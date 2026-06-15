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
  const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${groqApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: groqVisionModel,
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: createPlantAnalysisSystemPrompt(),
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

  return JSON.parse(content)
}

function createPlantAnalysisSystemPrompt() {
  return [
    'You are a plant image analysis assistant for a simple plant care web app.',
    'Return only valid JSON. Do not include markdown.',
    'Use Korean for user-facing strings.',
    'Choose plantKind from: monstera, peace, sansevieria, peperomia.',
    'Choose difficulty from: easy, normal, hard.',
    'Return this shape:',
    '{',
    '  "plantName": "string",',
    '  "latinName": "string",',
    '  "plantKind": "monstera | peace | sansevieria | peperomia",',
    '  "difficulty": "easy | normal | hard",',
    '  "difficultyLabel": "easy in Korean | normal in Korean | hard in Korean",',
    '  "confidence": 0,',
    '  "care": {',
    '    "water": { "k": "water label in Korean", "v": "string", "sub": "string" },',
    '    "light": { "k": "light label in Korean", "v": "string", "sub": "string" },',
    '    "temp": { "k": "temperature label in Korean", "v": "string", "sub": "string" },',
    '    "humidity": { "k": "humidity label in Korean", "v": "string", "sub": "string" }',
    '  },',
    '  "diagnosis": {',
    '    "score": 0,',
    '    "grade": "ok | warn | danger",',
    '    "gradeLabel": "string",',
    '    "summary": "string",',
    '    "issues": [{ "ic": "drop | sun | leaf", "t": "string", "sev": "high | mid | low", "c": "string" }],',
    '    "solutions": [{ "st": "string", "sd": "string" }]',
    '  }',
    '}',
  ].join('\n')
}

function sendJson(response: { statusCode: number; setHeader: (name: string, value: string) => void; end: (body: string) => void }, statusCode: number, body: unknown) {
  response.statusCode = statusCode
  response.setHeader('Content-Type', 'application/json')
  response.end(JSON.stringify(body))
}
