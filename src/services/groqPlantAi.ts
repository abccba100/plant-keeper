import type { PlantKind } from '../store/plantData'
import type { Answers, Diagnosis } from '../store/analyzeModel'
import type { Difficulty, SpeciesCare } from '../store/registerModel'

const plantKinds: PlantKind[] = ['monstera', 'peace', 'sansevieria', 'peperomia']
const difficultyLevels: Difficulty[] = ['easy', 'normal', 'hard']

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

  const responseBody = await response.json()

  if (!response.ok) {
    throw new Error(responseBody.message ?? 'AI 분석 요청에 실패했습니다.')
  }

  return normalizePlantAiResult(responseBody.result)
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('이미지를 읽지 못했습니다.'))
    reader.readAsDataURL(file)
  })
}

function normalizePlantAiResult(result: Partial<PlantAiResult>): PlantAiResult {
  const plantKind = plantKinds.includes(result.plantKind as PlantKind) ? result.plantKind as PlantKind : 'monstera'
  const difficulty = difficultyLevels.includes(result.difficulty as Difficulty) ? result.difficulty as Difficulty : 'normal'

  return {
    plantName: getRequiredText(result.plantName, '식물 이름'),
    latinName: getRequiredText(result.latinName, '학명'),
    plantKind,
    difficulty,
    difficultyLabel: result.difficultyLabel?.trim() || getDifficultyLabel(difficulty),
    confidence: getBoundedNumber(result.confidence, 0, 100, '일치율'),
    care: {
      water: normalizeCareItem(result.care?.water, '물주기'),
      light: normalizeCareItem(result.care?.light, '빛'),
      temp: normalizeCareItem(result.care?.temp, '온도'),
      humidity: normalizeCareItem(result.care?.humidity, '습도'),
    },
    diagnosis: result.diagnosis,
  }
}

function normalizeCareItem(item: Partial<SpeciesCare> | undefined, fieldName: string): SpeciesCare {
  if (!item) {
    throw new Error(`AI 응답에 ${fieldName} 관리 정보가 없습니다.`)
  }

  return {
    k: getRequiredText(item.k, `${fieldName} 항목명`),
    v: getRequiredText(item.v, `${fieldName} 관리값`),
    sub: getRequiredText(item.sub, `${fieldName} 설명`),
  }
}

function getRequiredText(value: unknown, fieldName: string) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`AI 응답에 ${fieldName} 값이 없습니다.`)
  }

  return value.trim()
}

function getBoundedNumber(value: unknown, min: number, max: number, fieldName: string) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new Error(`AI 응답에 ${fieldName} 값이 없습니다.`)
  }

  return Math.min(max, Math.max(min, Math.round(value)))
}

function getDifficultyLabel(difficulty: Difficulty) {
  if (difficulty === 'easy') return '쉬움'
  if (difficulty === 'hard') return '어려움'
  return '보통'
}
