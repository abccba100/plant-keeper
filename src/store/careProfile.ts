export type Difficulty = 'easy' | 'normal' | 'hard'

export interface CareProfile {
  name: string
  latin: string
  difficulty: Difficulty
  difficultyLabel: string
  desc: string
  origin: string
  type: string
  water: { v: string; note: string; level: number }
  light: { v: string; note: string; level: number }
  temp: { k: string; v: string; sub: string }
  humidity: { k: string; v: string; sub: string }
}

export const CARE_PROFILE: CareProfile = {
  name: '몬스테라 델리시오사',
  latin: 'Monstera deliciosa',
  difficulty: 'easy',
  difficultyLabel: '쉬움',
  desc: '잎이 크고 갈라진 모양이 매력적인 인기 관엽식물이에요. 환경 적응력이 좋아 처음 키우기에 부담이 적고, 밝은 간접광과 적당한 물주기만 지켜주면 잘 자랍니다.',
  origin: '중앙아메리카',
  type: '관엽식물',
  water: { v: '7 – 10일 간격', note: '겉흙 2~3cm가 마르면 충분히 주세요. 과습에 약하니 화분 받침의 고인 물은 버려주세요.', level: 2 },
  light: { v: '밝은 간접광', note: '직사광선은 잎을 태울 수 있어요. 창가에서 한 걸음 떨어진 밝은 자리가 좋아요.', level: 3 },
  temp: { k: '적정 온도', v: '18 – 27°C', sub: '실내 권장 · 10°C 이하 주의' },
  humidity: { k: '습도', v: '높음 선호', sub: '주 1~2회 잎 분무' },
}
