import type { PlantKind } from './plantData'

export type RegisterState = 'idle' | 'preview' | 'analyzing' | 'result' | 'registered'
export type Difficulty = 'easy' | 'normal' | 'hard'

export interface SpeciesCare {
  k: string
  v: string
  sub: string
}

export type Species = {
  name: string
  latin: string
  kind: PlantKind
  difficulty: Difficulty
  difficultyLabel: string
  confidence: number
  care: Record<'water' | 'light' | 'temp' | 'humidity', SpeciesCare>
}

export const SPECIES_BY_FILE: Species[] = [
  {
    name: '몬스테라 델리시오사',
    latin: 'Monstera deliciosa',
    kind: 'monstera',
    difficulty: 'easy',
    difficultyLabel: '쉬움',
    confidence: 96,
    care: {
      water: { k: '물주기', v: '7~10일 간격', sub: '겉흙이 마르면 충분히' },
      light: { k: '햇빛', v: '밝은 간접광', sub: '직사광선은 피하기' },
      temp: { k: '적정 온도', v: '18~27°C', sub: '실내 온도 권장' },
      humidity: { k: '습도', v: '높음 선호', sub: '주 1~2회 분무' },
    },
  },
  {
    name: '스파티필룸',
    latin: 'Spathiphyllum wallisii',
    kind: 'peace',
    difficulty: 'easy',
    difficultyLabel: '쉬움',
    confidence: 91,
    care: {
      water: { k: '물주기', v: '5~7일 간격', sub: '잎이 처지기 전 급수' },
      light: { k: '햇빛', v: '반음지', sub: '부드러운 실내광' },
      temp: { k: '적정 온도', v: '18~26°C', sub: '찬바람 주의' },
      humidity: { k: '습도', v: '중간 이상', sub: '건조하면 잎끝 확인' },
    },
  },
  {
    name: '산세베리아',
    latin: 'Dracaena trifasciata',
    kind: 'sansevieria',
    difficulty: 'easy',
    difficultyLabel: '쉬움',
    confidence: 88,
    care: {
      water: { k: '물주기', v: '2~3주 간격', sub: '흙이 완전히 마른 뒤' },
      light: { k: '햇빛', v: '간접광~반음지', sub: '어두운 곳도 적응' },
      temp: { k: '적정 온도', v: '16~28°C', sub: '10°C 이하 주의' },
      humidity: { k: '습도', v: '보통', sub: '분무는 적게' },
    },
  },
]

export const STEPS = [
  { key: 'upload', label: '이미지 업로드' },
  { key: 'analyze', label: 'AI 식물 인식' },
  { key: 'care', label: '관리 정보 등록' },
]

export function pickSpecies(fileName: string) {
  const key = fileName.toLowerCase()
  if (key.includes('peace') || key.includes('spath')) return SPECIES_BY_FILE[1]
  if (key.includes('snake') || key.includes('sanse')) return SPECIES_BY_FILE[2]
  return SPECIES_BY_FILE[0]
}

export function stepIndexFor(state: RegisterState) {
  if (state === 'idle' || state === 'preview') return 0
  if (state === 'analyzing') return 1
  return 2
}
