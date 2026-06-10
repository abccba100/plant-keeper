import type { PlantKind } from '../components/plant/PlantSvg'

export type AnalyzeState = 'input' | 'questions' | 'analyzing' | 'result'

export interface PlantOption {
  name: string
  kind: PlantKind
  tone: string
}

export type Diagnosis = {
  score: number
  grade: 'ok' | 'warn' | 'danger'
  gradeLabel: string
  summary: string
  issues: { ic: 'drop' | 'sun' | 'leaf'; t: string; sev: 'high' | 'mid' | 'low'; c: string }[]
  solutions: { st: string; sd: string }[]
}

export interface Question {
  id: string
  q: string
  sub: string
  multi: boolean
  opts: string[]
}

export const SUGGESTED: PlantOption[] = [
  { name: '몬스테라', kind: 'monstera', tone: '#71986f' },
  { name: '스파티필룸', kind: 'peace', tone: '#789671' },
  { name: '산세베리아', kind: 'sansevieria', tone: '#2f9aa3' },
  { name: '필레아 페페', kind: 'peperomia', tone: '#f0a21d' },
]

export const QUESTIONS: Question[] = [
  {
    id: 'water',
    q: '마지막으로 물을 준 건 언제인가요?',
    sub: '물주기 주기를 가늠해 볼게요.',
    multi: false,
    opts: ['3일 이내', '약 1주 전', '2주 이상', '기억나지 않아요'],
  },
  {
    id: 'light',
    q: '식물이 놓인 곳의 빛은 어떤가요?',
    sub: '광량은 잎 상태에 큰 영향을 줘요.',
    multi: false,
    opts: ['밝은 직사광', '밝은 간접광', '다소 어두운 실내'],
  },
  {
    id: 'symptom',
    q: '잎에서 보이는 변화를 모두 골라주세요.',
    sub: '여러 개를 선택할 수 있어요.',
    multi: true,
    opts: ['잎끝이 갈색', '노랗게 변함', '처지고 시듦', '반점·구멍', '특별한 변화 없음'],
  },
  {
    id: 'env',
    q: '실내 환경은 어떤 편인가요?',
    sub: '온도와 습도를 함께 볼게요.',
    multi: false,
    opts: ['건조하고 따뜻함', '적당한 편', '춥고 습함'],
  },
]

export type Answers = Record<string, string[] | undefined>

export const NO_SYMPTOM = '특별한 변화 없음'

export const AN_STEPS = [
  { key: 'input', label: '정보 입력' },
  { key: 'questions', label: 'AI 추가 질문' },
  { key: 'result', label: '진단 결과' },
]

export function anStepIndex(state: AnalyzeState) {
  if (state === 'input') return 0
  if (state === 'questions' || state === 'analyzing') return 1
  return 2
}

export function createDiagnosis(answers: Answers): Diagnosis {
  let score = 86
  const issues: Diagnosis['issues'] = []
  const solutions: Diagnosis['solutions'] = []
  const symptoms = answers.symptom ?? []
  const water = answers.water?.[0]
  const light = answers.light?.[0]
  const env = answers.env?.[0]

  if (water === '2주 이상' || water === '기억나지 않아요') {
    score -= 14
    issues.push({ ic: 'drop', t: '수분 부족 가능성', sev: 'high', c: '최근 물주기 간격이 길어 잎 처짐이나 갈변이 생길 수 있어요.' })
    solutions.push({ st: '겉흙 상태 확인 후 충분히 물주기', sd: '화분 받침에 고인 물은 버리고, 다음 급수는 흙이 마른 뒤 진행하세요.' })
  } else if (water === '3일 이내') {
    score -= 10
    issues.push({ ic: 'drop', t: '과습 신호', sev: 'mid', c: '급수 간격이 짧으면 뿌리가 숨쉬기 어려워질 수 있어요.' })
    solutions.push({ st: '급수 간격 늘리기', sd: '겉흙 2~3cm가 마른 뒤 물을 주고 통풍을 확보하세요.' })
  }

  if (light === '다소 어두운 실내') {
    score -= 9
    issues.push({ ic: 'sun', t: '광량 부족', sev: 'mid', c: '어두운 자리에서는 새잎이 작아지고 아래쪽 잎이 노랗게 변할 수 있어요.' })
    solutions.push({ st: '밝은 간접광 위치로 옮기기', sd: '창가에서 한두 걸음 떨어진 밝은 자리가 좋아요.' })
  }

  if (env === '건조하고 따뜻함' || symptoms.includes('잎끝이 갈색')) {
    score -= 8
    issues.push({ ic: 'leaf', t: '습도 부족', sev: 'low', c: '건조한 공기는 잎끝 마름을 빠르게 만들 수 있어요.' })
    solutions.push({ st: '주 2회 분무와 잎 정리', sd: '마른 잎끝은 깨끗한 가위로 정리하고 주변 습도를 올려주세요.' })
  }

  if (symptoms.includes('반점·구멍')) {
    score -= 12
    issues.push({ ic: 'leaf', t: '병해충 관찰 필요', sev: 'high', c: '반점이나 구멍은 해충 또는 잎 손상의 초기 신호일 수 있어요.' })
    solutions.push({ st: '잎 뒷면과 줄기 확인', sd: '해충 흔적이 있으면 다른 식물과 잠시 분리하고 잎을 닦아주세요.' })
  }

  if (issues.length === 0) {
    issues.push({ ic: 'leaf', t: '큰 이상 없음', sev: 'low', c: '현재 입력 기준으로는 급한 문제 신호가 적어요.' })
    solutions.push({ st: '현재 루틴 유지', sd: '2주 뒤 잎 색과 새잎 상태를 다시 확인하세요.' })
  }

  solutions.push({ st: '2주 후 상태 다시 확인', sd: '잎 색, 흙 마름 속도, 새잎 변화를 보고 물주기 주기를 미세 조정하세요.' })
  const boundedScore = Math.max(35, Math.min(96, score))
  const grade = boundedScore >= 80 ? 'ok' : boundedScore >= 60 ? 'warn' : 'danger'

  return {
    score: boundedScore,
    grade,
    gradeLabel: grade === 'ok' ? '전반적으로 건강해요' : grade === 'warn' ? '주의가 필요해요' : '빠른 관리가 필요해요',
    summary:
      grade === 'ok'
        ? '입력한 상태로는 큰 이상 신호가 적어요. 현재 관리 루틴을 유지하되 잎끝과 흙 마름 속도를 관찰해 주세요.'
        : grade === 'warn'
          ? '치명적인 문제는 아니지만 물주기, 빛, 습도 중 일부를 조정하면 회복 가능성이 높아요.'
          : '수분과 병해충 상태를 우선 확인해야 해요. 관리 환경을 조정하고 며칠 간 변화를 기록해 주세요.',
    issues,
    solutions,
  }
}
