import { createDiagnosis, type Answers, type Diagnosis } from '../store/analyzeModel'
import type { PlantKind } from '../store/plantData'
import type { Difficulty, SpeciesCare } from '../store/registerModel'

const plantKinds: PlantKind[] = ['monstera', 'peace', 'sansevieria', 'peperomia']
const difficultyLevels: Difficulty[] = ['easy', 'normal', 'hard']

type ApiObject = Record<string, unknown>

export type PlantAiMode = 'identify' | 'diagnose'

export interface PlantAiCare {
  water: SpeciesCare
  light: SpeciesCare
  temp: SpeciesCare
  humidity: SpeciesCare
}

export interface PlantAiResult {
  plantName: string
  latinName: string
  plantKind: PlantKind
  difficulty: Difficulty
  difficultyLabel: string
  confidence: number
  care: PlantAiCare
  diagnosis?: Diagnosis
}

interface AnalyzePlantImageInput {
  imageFile: File
  mode: PlantAiMode
  plantName?: string
  answers?: Answers
}

export async function analyzePlantImage(input: AnalyzePlantImageInput): Promise<PlantAiResult> {
  const imageDataUrl = await readFileAsDataUrl(input.imageFile)
  const response = await fetch('/api/analyze-plant', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      imageDataUrl,
      mode: input.mode,
      plantName: input.plantName,
      answers: input.answers,
    }),
  })

  const apiJson = await readApiJson(response)

  if (!response.ok) {
    throw new Error(getText(apiJson.message) || 'AI 분석 요청에 실패했습니다.')
  }

  return createPlantAiResult(getApiResult(apiJson.result), input)
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('이미지를 읽지 못했습니다.'))
    reader.readAsDataURL(file)
  })
}

async function readApiJson(response: Response): Promise<ApiObject> {
  const responseText = await response.text()

  try {
    const parsed = JSON.parse(responseText)
    return getObject(parsed) || {}
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('[PlantAI] JSON 응답 파싱 실패', {
        status: response.status,
        bodyPreview: responseText.slice(0, 500),
        error,
      })
    }

    throw new Error(`AI 응답을 JSON으로 읽지 못했습니다. 상태 코드: ${response.status}`, { cause: error })
  }
}

function getApiResult(value: unknown): ApiObject {
  const result = getObject(value)

  if (!result) {
    return {}
  }

  return getObject(result.result) || getObject(result.data) || result
}

function createPlantAiResult(result: ApiObject, input: AnalyzePlantImageInput): PlantAiResult {
  const plantName = getPlantName(result, input)
  const plantKind = getPlantKind(result.plantKind, plantName)
  const difficulty = getDifficulty(result.difficulty)
  const confidence = getConfidence(result.confidence, input.mode, plantName)
  const care = getCare(result.care)

  return {
    plantName,
    latinName: getText(result.latinName) || '미확인',
    plantKind,
    difficulty,
    difficultyLabel: getText(result.difficultyLabel) || getDifficultyLabel(difficulty),
    confidence,
    care,
    diagnosis: input.mode === 'diagnose' ? getDiagnosis(result.diagnosis, input.answers) : undefined,
  }
}

function getPlantName(result: ApiObject, input: AnalyzePlantImageInput) {
  const apiPlantName = getText(result.plantName)

  if (input.mode === 'diagnose') {
    return apiPlantName || input.plantName?.trim() || '내 식물'
  }

  if (!apiPlantName || isBroadPlantName(apiPlantName)) {
    return '식별이 어려운 관엽식물'
  }

  return apiPlantName
}

function getPlantKind(value: unknown, plantName: string): PlantKind {
  const apiKind = getText(value)

  if (apiKind && plantKinds.includes(apiKind as PlantKind)) {
    return apiKind as PlantKind
  }

  const normalizedName = plantName.toLowerCase()

  if (normalizedName.includes('몬스테라') || normalizedName.includes('monstera')) {
    return 'monstera'
  }

  if (normalizedName.includes('스파티') || normalizedName.includes('peace') || normalizedName.includes('spathiphyllum')) {
    return 'peace'
  }

  if (normalizedName.includes('산세') || normalizedName.includes('snake') || normalizedName.includes('sansevieria') || normalizedName.includes('dracaena')) {
    return 'sansevieria'
  }

  if (normalizedName.includes('페페') || normalizedName.includes('peperomia') || normalizedName.includes('필레아') || normalizedName.includes('pilea')) {
    return 'peperomia'
  }

  return 'peperomia'
}

function getDifficulty(value: unknown): Difficulty {
  const difficulty = getText(value)

  if (difficulty && difficultyLevels.includes(difficulty as Difficulty)) {
    return difficulty as Difficulty
  }

  return 'normal'
}

function getConfidence(value: unknown, mode: PlantAiMode, plantName: string) {
  const fallback = mode === 'diagnose' ? 70 : 60
  const confidence = getNumber(value, 0, 100) ?? fallback

  if (mode === 'identify' && isBroadPlantName(plantName)) {
    return Math.min(confidence, 54)
  }

  return confidence
}

function getCare(value: unknown): PlantAiCare {
  const care = getObject(value) || {}
  const fallback = getFallbackCare()

  return {
    water: getCareItem(care.water, fallback.water),
    light: getCareItem(care.light, fallback.light),
    temp: getCareItem(care.temp, fallback.temp),
    humidity: getCareItem(care.humidity, fallback.humidity),
  }
}

function getCareItem(value: unknown, fallback: SpeciesCare): SpeciesCare {
  const item = getObject(value)

  if (!item) {
    return fallback
  }

  return {
    k: getText(item.k) || fallback.k,
    v: getText(item.v) || fallback.v,
    sub: getText(item.sub) || fallback.sub,
  }
}

function getDiagnosis(value: unknown, answers: Answers | undefined): Diagnosis {
  const fallback = createFallbackDiagnosis(answers)
  const diagnosis = getObject(value)

  if (!diagnosis) {
    return fallback
  }

  const issues = getIssues(diagnosis.issues, fallback.issues)
  const score = adjustScoreByIssues(getNumber(diagnosis.score, 0, 100) ?? fallback.score, issues)
  const grade = getGradeFromScore(score)

  return {
    score,
    grade,
    gradeLabel: getText(diagnosis.gradeLabel) || getGradeLabel(grade),
    summary: getText(diagnosis.summary) || fallback.summary,
    issues,
    solutions: getSolutions(diagnosis.solutions, fallback.solutions),
  }
}

function createFallbackDiagnosis(answers: Answers | undefined): Diagnosis {
  const diagnosis = createDiagnosis(answers ?? {})
  const score = Math.min(diagnosis.score, 68)
  const grade = getGradeFromScore(score)

  return {
    ...diagnosis,
    score,
    grade,
    gradeLabel: getGradeLabel(grade),
    summary: score < diagnosis.score
      ? 'AI 진단 값이 부족해 이미지 상태를 보수적으로 다시 확인해야 해요.'
      : diagnosis.summary,
  }
}

function getIssues(value: unknown, fallback: Diagnosis['issues']): Diagnosis['issues'] {
  if (!Array.isArray(value) || value.length === 0) {
    return fallback
  }

  const issues = value.slice(0, 4).map((item) => {
    const issue = getObject(item) || {}
    const icon = getIssueIcon(issue.ic)
    const severity = getSeverity(issue.sev)

    return {
      ic: icon,
      t: getText(issue.t) || '관찰 필요',
      sev: severity,
      c: getText(issue.c) || '이미지와 답변을 함께 보고 상태를 다시 확인해 주세요.',
    }
  })

  return issues.length > 0 ? issues : fallback
}

function getSolutions(value: unknown, fallback: Diagnosis['solutions']): Diagnosis['solutions'] {
  if (!Array.isArray(value) || value.length === 0) {
    return fallback
  }

  const solutions = value.slice(0, 4).map((item) => {
    const solution = getObject(item) || {}

    return {
      st: getText(solution.st) || '상태 다시 확인',
      sd: getText(solution.sd) || '잎, 줄기, 흙 상태를 같은 조명에서 다시 기록해 주세요.',
    }
  })

  return solutions.length > 0 ? solutions : fallback
}

function adjustScoreByIssues(score: number, issues: Diagnosis['issues']) {
  if (issues.some((issue) => issue.sev === 'high')) {
    return Math.min(score, 54)
  }

  if (issues.some((issue) => issue.sev === 'mid')) {
    return Math.min(score, 74)
  }

  if (issues.some((issue) => issue.sev === 'low')) {
    return Math.min(score, 89)
  }

  return score
}

function getIssueIcon(value: unknown): Diagnosis['issues'][number]['ic'] {
  if (value === 'drop' || value === 'sun' || value === 'leaf') {
    return value
  }

  return 'leaf'
}

function getSeverity(value: unknown): Diagnosis['issues'][number]['sev'] {
  if (value === 'high' || value === 'mid' || value === 'low') {
    return value
  }

  return 'mid'
}

function getObject(value: unknown): ApiObject | undefined {
  if (typeof value === 'object' && value !== null) {
    return value as ApiObject
  }
}

function getText(value: unknown) {
  if (typeof value !== 'string') {
    return undefined
  }

  const text = value.trim()

  if (!text || isPlaceholderText(text)) {
    return undefined
  }

  return text
}

function getNumber(value: unknown, min: number, max: number) {
  const numberValue = typeof value === 'string' ? Number(value.replace('%', '').trim()) : value

  if (typeof numberValue !== 'number' || Number.isNaN(numberValue)) {
    return undefined
  }

  return Math.min(max, Math.max(min, Math.round(numberValue)))
}

function getDifficultyLabel(difficulty: Difficulty) {
  if (difficulty === 'easy') {
    return '쉬움'
  }

  if (difficulty === 'hard') {
    return '어려움'
  }

  return '보통'
}

function getGradeLabel(grade: Diagnosis['grade']) {
  if (grade === 'ok') {
    return '전반적으로 안정적이에요'
  }

  if (grade === 'danger') {
    return '빠른 관리가 필요해요'
  }

  return '주의가 필요해요'
}

function getGradeFromScore(score: number): Diagnosis['grade'] {
  if (score >= 80) {
    return 'ok'
  }

  if (score >= 55) {
    return 'warn'
  }

  return 'danger'
}

function getFallbackCare(): PlantAiCare {
  return {
    water: { k: '물주기', v: '흙 상태에 따라 조정', sub: '겉흙 마름 확인' },
    light: { k: '빛', v: '밝은 간접광', sub: '직사광은 피하기' },
    temp: { k: '온도', v: '18~27°C', sub: '급격한 온도 변화 주의' },
    humidity: { k: '습도', v: '중간 이상', sub: '잎 상태에 따라 분무' },
  }
}

function isPlaceholderText(text: string) {
  const normalized = text.toLowerCase()

  return [
    'string',
    'unknown',
    'n/a',
    'null',
    'undefined',
    '식물 이름',
    '학명',
    '알 수 없는 식물',
    'water label in korean',
    'light label in korean',
    'temperature label in korean',
    'humidity label in korean',
  ].includes(normalized)
}

function isBroadPlantName(text: string) {
  return [
    '식물',
    '화초',
    '관엽식물',
    '실내식물',
    '잎 식물',
    'houseplant',
    'indoor plant',
    'plant',
  ].includes(text.trim().toLowerCase())
}
