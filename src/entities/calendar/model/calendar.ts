import { plants, type Plant } from '../../plant/model/plant'

export type Season = 'spring' | 'summer' | 'autumn' | 'winter'

export type CalendarDay = {
  date: number
  inMonth: boolean
  isSunday: boolean
  isToday?: boolean
  isSelected?: boolean
  moisture: 'dry' | 'balanced' | 'wet' | 'frost'
  growth: 0 | 1 | 2 | 3
  density: 0 | 1 | 2 | 3
  plants: Plant[]
}

export const weekdays = ['월', '화', '수', '목', '금', '토', '일']

export const seasonOrder: Season[] = ['spring', 'summer', 'autumn', 'winter']

export const seasonMeta: Record<
  Season,
  {
    label: string
    month: string
    tipTitle: string
    tip: string
  }
> = {
  spring: {
    label: '봄',
    month: '2024년 4월',
    tipTitle: '봄 관리 팁',
    tip: '새싹이 자라는 계절이에요. 햇빛과 통풍을 충분히 해주고, 분갈이와 영양제 관리도 함께 해주세요.',
  },
  summer: {
    label: '여름',
    month: '2024년 7월',
    tipTitle: '여름 관리 팁',
    tip: '습도가 높아 과습에 주의하세요. 통풍이 잘 되는 환경을 유지해주세요.',
  },
  autumn: {
    label: '가을',
    month: '2024년 10월',
    tipTitle: '가을 관리 팁',
    tip: '일교차가 커지는 계절이에요. 과습에 주의하고 통풍을 잘 유지해주세요.',
  },
  winter: {
    label: '겨울',
    month: '2024년 12월',
    tipTitle: '겨울 관리 팁',
    tip: '실내 습도를 유지하고 찬바람을 피해 주세요. 식물의 성장 속도가 느려지는 시기입니다.',
  },
}

const dayNumbersBySeason: Record<Season, number[]> = {
  spring: [...Array.from({ length: 30 }, (_, index) => index + 1), ...Array.from({ length: 12 }, (_, index) => index + 1)],
  summer: [...Array.from({ length: 31 }, (_, index) => index + 1), ...Array.from({ length: 11 }, (_, index) => index + 1)],
  autumn: [30, ...Array.from({ length: 31 }, (_, index) => index + 1), 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  winter: [25, 26, 27, 28, 29, 30, ...Array.from({ length: 31 }, (_, index) => index + 1), 1, 2, 3, 4, 5],
}

export function getCalendarDays(season: Season, selectedDate: number): CalendarDay[] {
  const startIndex = season === 'winter' ? 6 : season === 'autumn' ? 1 : 0
  const daysInMonth = season === 'spring' ? 30 : 31
  const today = season === 'summer' ? 3 : season === 'spring' ? 17 : season === 'autumn' ? 13 : 25

  return dayNumbersBySeason[season].slice(0, 42).map((date, index) => {
    const inMonth = index >= startIndex && index < startIndex + daysInMonth
    const density = (inMonth ? ((index + date) % 4) : 0) as CalendarDay['density']
    const plantCount = inMonth ? Math.max(1, Math.min(3, density + (season === 'winter' ? 1 : 2))) : 1
    const offset = (index + date) % plants.length
    const dayPlants = Array.from({ length: plantCount }, (_, plantIndex) => plants[(offset + plantIndex) % plants.length])

    return {
      date,
      inMonth,
      isSunday: index % 7 === 6,
      isToday: inMonth && date === today,
      isSelected: inMonth && date === selectedDate,
      moisture: season === 'winter' ? 'frost' : index % 5 === 0 ? 'wet' : index % 3 === 0 ? 'dry' : 'balanced',
      growth: ((index + date) % 4) as CalendarDay['growth'],
      density,
      plants: dayPlants,
    }
  })
}
