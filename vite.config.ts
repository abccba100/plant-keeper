import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

const groqVisionModel = 'meta-llama/llama-4-scout-17b-16e-instruct'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), groqPlantAiProxy(env.GROQ_API_KEY)],
    resolve: {
      preserveSymlinks: true,
    },
    build: {
      chunkSizeWarningLimit: 600,
      cssCodeSplit: true,
      assetsInlineLimit: 4096,
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
              return 'vendor-react'
            }
            if (id.includes('node_modules/@fullcalendar/')) {
              return 'vendor-fullcalendar'
            }
            if (id.includes('node_modules/@emotion/')) {
              return 'vendor-emotion'
            }
            if (id.includes('node_modules/zustand/')) {
              return 'vendor-zustand'
            }
          },
        },
      },
    },
  }
})

function groqPlantAiProxy(groqApiKey: string | undefined): Plugin {
  return {
    name: 'groq-plant-ai-proxy',
    configureServer(server) {
      server.middlewares.use('/api/analyze-plant', async (request, response) => {
        if (request.method !== 'POST') {
          sendJson(response, 405, { message: 'POST 요청만 사용할 수 있습니다.' })
          return
        }

        if (!groqApiKey) {
          sendJson(response, 500, { message: '.env 파일에 GROQ_API_KEY를 입력해 주세요.' })
          return
        }

        try {
          const requestBody = await readJsonBody(request)
          const result = await requestGroqPlantAnalysis(groqApiKey, requestBody)
          sendJson(response, 200, { result })
        } catch (error) {
          const message = error instanceof Error ? error.message : 'AI 분석 중 오류가 발생했습니다.'
          sendJson(response, 500, { message })
        }
      })
    },
  }
}

function readJsonBody(request: NodeJS.ReadableStream) {
  return new Promise<Record<string, unknown>>((resolve, reject) => {
    let body = ''

    request.on('data', (chunk) => {
      body += chunk
    })

    request.on('end', () => {
      try {
        resolve(JSON.parse(body))
      } catch {
        reject(new Error('요청 데이터를 읽지 못했습니다.'))
      }
    })

    request.on('error', () => reject(new Error('요청 데이터를 읽지 못했습니다.')))
  })
}

async function requestGroqPlantAnalysis(groqApiKey: string, requestBody: Record<string, unknown>) {
  const mode = requestBody.mode === 'diagnose' ? 'diagnose' : 'identify'
  const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${groqApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: groqVisionModel,
      temperature: 0.1,
      seed: 240617,
      max_completion_tokens: 1800,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: createPlantAnalysisSystemPrompt(mode),
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                mode: requestBody.mode,
                plantName: requestBody.plantName,
                answers: requestBody.answers,
              }),
            },
            {
              type: 'image_url',
              image_url: { url: requestBody.imageDataUrl },
            },
          ],
        },
      ],
    }),
  })

  const groqBody = await groqResponse.json() as {
    error?: { message?: string }
    choices?: { message?: { content?: string } }[]
  }

  if (!groqResponse.ok) {
    throw new Error(groqBody.error?.message ?? 'Groq API 요청에 실패했습니다.')
  }

  const content = groqBody.choices?.[0]?.message?.content
  if (typeof content !== 'string') {
    throw new Error('Groq 응답을 읽지 못했습니다.')
  }

  return parseGroqJson(content)
}

function createPlantAnalysisSystemPrompt(mode: 'identify' | 'diagnose') {
  const sharedRules = [
    'You return exactly one JSON object and nothing else.',
    'Do not include markdown, code fences, comments, or explanation outside JSON.',
    'All user-facing strings must be Korean except latinName.',
    'Do not output schema placeholder text such as string, label, unknown, N/A, null, undefined, or examples copied verbatim.',
    'plantKind is only a UI avatar category. It must be one of: monstera, peace, sansevieria, peperomia.',
    'plantName must be the best real-world plant name inferred from the image. It is not limited to the four plantKind values.',
    'If the exact species is unclear, use a cautious Korean name such as "식별이 어려운 관엽식물" and lower confidence.',
    'latinName should be a likely scientific name. If uncertain, use "미확인".',
    'difficulty must be one of: easy, normal, hard.',
    'difficultyLabel must be one of: 쉬움, 보통, 어려움.',
    'confidence and diagnosis.score must be numbers from 0 to 100.',
    'care must always include water, light, temp, and humidity objects with k, v, sub.',
    'Care values should be short and practical, for example "7~10일 간격", "밝은 간접광", "18~27°C".',
    'The examples below are calibration examples only. Do not copy an example unless the uploaded image visually matches it.',
  ]

  const identifyRules = [
    'Role: plant identification specialist.',
    'Task: identify the plant from the image and return basic care guidance.',
    'Do not overfit to the UI avatar category. plantName carries the real identification.',
    'Identification protocol: first inspect visible leaf shape, leaf arrangement, venation, variegation, stem/vine habit, growth form, pot context, and flower/spathe if visible; then compare at least 3 plausible houseplant candidates internally before choosing plantName.',
    'plantName naming rule: return the most specific Korean common name supported by visible evidence. Prefer species or cultivar/common-trade name such as "몬스테라 델리시오사", "스킨답서스 골든 포토스", "스파티필룸", "필레아 페페로미오이데스", "인도고무나무" over broad names such as "관엽식물", "화초", or only "식물".',
    'If only the genus is visually supportable, use a cautious genus-level Korean name such as "필로덴드론류" or "페페로미아류" and keep confidence below 70.',
    'Do not invent a species when key features are hidden. If the image is too cropped, blurred, backlit, or shows only generic leaves, use "식별이 어려운 관엽식물" and confidence below 55.',
    'Common confusion checks: distinguish Monstera deliciosa from Rhaphidophora tetrasperma and Philodendron by mature fenestrations and leaf size; distinguish Spathiphyllum from Anthurium by white spathe and leaf texture; distinguish Epipremnum aureum from Philodendron hederaceum by variegation and vine leaf shape; distinguish Dracaena trifasciata from other Dracaena by upright sword leaves.',
    'Confidence rubric: 85-98 for visually clear species, 65-84 for likely species, 35-64 for ambiguous or low-quality image.',
    'Do not return diagnosis for identify mode.',
    'Required top-level keys: plantName, latinName, plantKind, difficulty, difficultyLabel, confidence, care.',
    'Visual calibration examples for identify mode:',
    ...createIdentifyFewShotExamples(),
  ]

  const diagnoseRules = [
    'Role: plant health diagnosis specialist.',
    'Task: judge the current health condition from the uploaded image and user answers.',
    'The user answers are supporting context, but the image is the primary evidence. If the image shows wilting, yellowing, browning, spots, holes, mold, pests, root/soil stress, or severe droop, reflect that in score, grade, issues, and solutions even when the answers sound normal.',
    'Do not give a high score just because the care answers are reasonable. Visible plant damage must lower the score.',
    'Score rubric: 90-100 only for visibly healthy plants with minimal defects; 75-89 for minor cosmetic issues; 55-74 for clear stress such as droop, yellowing, browning, repeated spots, or dry/crispy leaves; 0-54 for severe decline, widespread damage, likely disease/pests, rot, mold, or multiple strong stress signs.',
    'Grade rubric: ok only when score is 80 or higher and visible symptoms are minor; warn for 55-79; danger for 0-54.',
    'diagnosis.issues must contain 1 to 4 concrete issues. Each issue must use ic from drop, sun, leaf and sev from high, mid, low.',
    'diagnosis.solutions must contain 1 to 4 practical steps.',
    'Required top-level keys: plantName, latinName, plantKind, difficulty, difficultyLabel, confidence, care, diagnosis.',
    'Required diagnosis keys: score, grade, gradeLabel, summary, issues, solutions.',
    'Visual calibration examples for diagnose mode:',
    ...createDiagnoseFewShotExamples(),
  ]

  return [
    ...sharedRules,
    ...(mode === 'diagnose' ? diagnoseRules : identifyRules),
  ].join('\n')
}

function createIdentifyFewShotExamples() {
  return [
    'Example A visual evidence: large glossy green leaves with deep splits and oval holes, thick climbing stems, indoor pot near bright indirect light.',
    `Example A output: ${JSON.stringify({
      plantName: '몬스테라 델리시오사',
      latinName: 'Monstera deliciosa',
      plantKind: 'monstera',
      difficulty: 'normal',
      difficultyLabel: '보통',
      confidence: 92,
      care: {
        water: { k: '물주기', v: '7~10일 간격', sub: '겉흙 2~3cm가 마르면 충분히 주세요.' },
        light: { k: '빛', v: '밝은 간접광', sub: '강한 직사광은 잎 화상을 만들 수 있어요.' },
        temp: { k: '온도', v: '18~27°C', sub: '찬바람과 급격한 온도 변화를 피하세요.' },
        humidity: { k: '습도', v: '중간 이상', sub: '건조하면 잎 끝이 마를 수 있어요.' },
      },
    })}`,
    'Example B visual evidence: upright sword-like stiff leaves with green banding or yellow margins, leaves grow vertically from the soil.',
    `Example B output: ${JSON.stringify({
      plantName: '산세베리아',
      latinName: 'Dracaena trifasciata',
      plantKind: 'sansevieria',
      difficulty: 'easy',
      difficultyLabel: '쉬움',
      confidence: 89,
      care: {
        water: { k: '물주기', v: '2~3주 간격', sub: '흙이 완전히 마른 뒤 물을 주세요.' },
        light: { k: '빛', v: '간접광~반음지', sub: '어두운 곳도 버티지만 밝은 곳에서 더 잘 자라요.' },
        temp: { k: '온도', v: '18~30°C', sub: '10°C 이하의 추위는 피하세요.' },
        humidity: { k: '습도', v: '보통', sub: '일반 실내 습도에 잘 적응해요.' },
      },
    })}`,
    'Example C visual evidence: trailing vine with heart-shaped green leaves, yellow-green marbling or variegation, flexible stems hanging from a pot or climbing support.',
    `Example C output: ${JSON.stringify({
      plantName: '스킨답서스 골든 포토스',
      latinName: 'Epipremnum aureum',
      plantKind: 'peperomia',
      difficulty: 'easy',
      difficultyLabel: '쉬움',
      confidence: 88,
      care: {
        water: { k: '물주기', v: '7~14일 간격', sub: '겉흙이 마른 뒤 충분히 주세요.' },
        light: { k: '빛', v: '밝은 간접광', sub: '무늬를 유지하려면 너무 어두운 곳은 피하세요.' },
        temp: { k: '온도', v: '18~28°C', sub: '찬바람과 낮은 온도는 피하세요.' },
        humidity: { k: '습도', v: '보통~높게', sub: '건조하면 잎 끝이 마를 수 있어요.' },
      },
    })}`,
    'Example D visual evidence: broad glossy oval leaves rising from the base, white spoon-like spathe flower or flower stalk may be visible, leaves arch gently.',
    `Example D output: ${JSON.stringify({
      plantName: '스파티필룸',
      latinName: 'Spathiphyllum wallisii',
      plantKind: 'peace',
      difficulty: 'easy',
      difficultyLabel: '쉬움',
      confidence: 91,
      care: {
        water: { k: '물주기', v: '흙 마름 확인 후', sub: '겉흙이 마르면 물을 주되 과습은 피하세요.' },
        light: { k: '빛', v: '밝은 간접광', sub: '강한 직사광은 잎을 상하게 할 수 있어요.' },
        temp: { k: '온도', v: '18~26°C', sub: '냉난방 바람을 직접 맞지 않게 하세요.' },
        humidity: { k: '습도', v: '높게', sub: '건조하면 처짐과 갈변이 생길 수 있어요.' },
      },
    })}`,
    'Example E visual evidence: plant is cropped, blurred, backlit, or only a small portion of generic green leaves is visible.',
    `Example E output: ${JSON.stringify({
      plantName: '식별이 어려운 관엽식물',
      latinName: '미확인',
      plantKind: 'peperomia',
      difficulty: 'normal',
      difficultyLabel: '보통',
      confidence: 42,
      care: {
        water: { k: '물주기', v: '흙 상태에 따라 조정', sub: '겉흙이 마른 뒤 과습을 피해서 주세요.' },
        light: { k: '빛', v: '밝은 간접광', sub: '사진이 불명확해 일반 관엽식물 기준으로 안내해요.' },
        temp: { k: '온도', v: '18~27°C', sub: '실내 온도를 안정적으로 유지하세요.' },
        humidity: { k: '습도', v: '중간', sub: '잎이 마르면 주변 습도를 조금 올려 주세요.' },
      },
    })}`,
  ]
}

function createDiagnoseFewShotExamples() {
  return [
    'Example A visual evidence: glossy green monstera leaves, firm stems, no yellowing, no brown patches, no severe droop.',
    `Example A output: ${JSON.stringify({
      plantName: '몬스테라 델리시오사',
      latinName: 'Monstera deliciosa',
      plantKind: 'monstera',
      difficulty: 'normal',
      difficultyLabel: '보통',
      confidence: 90,
      care: {
        water: { k: '물주기', v: '7~10일 간격', sub: '겉흙이 마르면 충분히 주세요.' },
        light: { k: '빛', v: '밝은 간접광', sub: '잎이 타지 않게 직사광은 피하세요.' },
        temp: { k: '온도', v: '18~27°C', sub: '찬바람을 피하고 일정하게 유지하세요.' },
        humidity: { k: '습도', v: '중간 이상', sub: '잎 끝 마름이 보이면 습도를 보강하세요.' },
      },
      diagnosis: {
        score: 91,
        grade: 'ok',
        gradeLabel: '전반적으로 안정적이에요',
        summary: '잎색과 줄기 탄력이 좋아 현재 상태는 안정적으로 보여요.',
        issues: [{ ic: 'leaf', t: '큰 이상 없음', sev: 'low', c: '뚜렷한 변색이나 처짐이 거의 보이지 않아요.' }],
        solutions: [{ st: '현재 관리 유지', sd: '밝은 간접광과 규칙적인 흙 마름 확인을 유지하세요.' }],
      },
    })}`,
    'Example B visual evidence: several leaves are yellow, leaf edges or tips are brown, plant looks stressed but stems are mostly standing.',
    `Example B output: ${JSON.stringify({
      plantName: '관엽식물',
      latinName: '미확인',
      plantKind: 'peace',
      difficulty: 'normal',
      difficultyLabel: '보통',
      confidence: 70,
      care: {
        water: { k: '물주기', v: '흙 마름 확인 후', sub: '흙 속까지 젖어 있으면 물주기를 미루세요.' },
        light: { k: '빛', v: '밝은 간접광', sub: '강한 직사광과 너무 어두운 위치를 피하세요.' },
        temp: { k: '온도', v: '18~26°C', sub: '냉난방 바람을 직접 맞지 않게 하세요.' },
        humidity: { k: '습도', v: '중간 이상', sub: '건조하면 갈변이 빨라질 수 있어요.' },
      },
      diagnosis: {
        score: 63,
        grade: 'warn',
        gradeLabel: '주의가 필요해요',
        summary: '노란 잎과 갈변이 보여 수분이나 뿌리 스트레스를 점검해야 해요.',
        issues: [
          { ic: 'leaf', t: '잎 변색', sev: 'mid', c: '노란 잎과 갈색 가장자리는 수분 불균형이나 뿌리 스트레스에서 자주 보여요.' },
          { ic: 'drop', t: '활력 저하', sev: 'mid', c: '일부 잎의 탄력이 약해 보여요.' },
        ],
        solutions: [
          { st: '흙 속 습도 확인', sd: '겉흙만 보지 말고 손가락이나 막대로 속흙이 젖었는지 확인하세요.' },
          { st: '손상 잎 정리', sd: '완전히 노랗거나 마른 잎은 제거하고 새잎 변화를 관찰하세요.' },
        ],
      },
    })}`,
    'Example C visual evidence: peace lily or similar plant has strong whole-plant droop, limp leaves hanging down, possible yellowing or dark wet soil.',
    `Example C output: ${JSON.stringify({
      plantName: '스파티필룸',
      latinName: 'Spathiphyllum wallisii',
      plantKind: 'peace',
      difficulty: 'easy',
      difficultyLabel: '쉬움',
      confidence: 83,
      care: {
        water: { k: '물주기', v: '흙 상태 기준', sub: '과습과 건조 모두 처짐을 만들 수 있어 속흙을 먼저 확인하세요.' },
        light: { k: '빛', v: '밝은 간접광', sub: '직사광은 피하고 너무 어두운 곳도 피하세요.' },
        temp: { k: '온도', v: '18~26°C', sub: '찬바람과 급격한 온도 변화를 피하세요.' },
        humidity: { k: '습도', v: '높게', sub: '건조한 실내에서는 잎이 쉽게 처질 수 있어요.' },
      },
      diagnosis: {
        score: 48,
        grade: 'danger',
        gradeLabel: '빠른 관리가 필요해요',
        summary: '전체적으로 잎이 강하게 처져 수분 문제나 뿌리 스트레스 가능성이 커 보여요.',
        issues: [
          { ic: 'drop', t: '심한 처짐', sev: 'high', c: '잎과 줄기가 아래로 크게 처져 즉시 환경 점검이 필요해요.' },
          { ic: 'leaf', t: '수분 스트레스', sev: 'mid', c: '과습과 건조 모두 가능한 상태라 흙과 배수를 확인해야 해요.' },
        ],
        solutions: [
          { st: '속흙과 배수 확인', sd: '화분 밑 물 고임과 냄새를 확인하고, 젖어 있으면 물주기를 중단하세요.' },
          { st: '회복 위치 조정', sd: '밝은 간접광, 안정적인 온도, 통풍이 되는 곳에서 회복을 관찰하세요.' },
        ],
      },
    })}`,
  ]
}

function parseGroqJson(content: string) {
  try {
    return JSON.parse(content)
  } catch {
    const start = content.indexOf('{')
    const end = content.lastIndexOf('}')

    if (start >= 0 && end > start) {
      try {
        return JSON.parse(content.slice(start, end + 1))
      } catch {
        // Fall through to the normalized error below.
      }
    }
  }

  throw new Error('Groq 응답 JSON을 해석하지 못했습니다.')
}

function sendJson(response: { statusCode: number; setHeader: (name: string, value: string) => void; end: (body: string) => void }, statusCode: number, body: unknown) {
  response.statusCode = statusCode
  response.setHeader('Content-Type', 'application/json')
  response.end(JSON.stringify(body))
}
