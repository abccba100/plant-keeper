import { plants, type Plant, type PlantKind } from '../../plant/model/plant'

export type Season = 'spring' | 'summer' | 'autumn' | 'winter'

export type CalendarTaskType = 'watering' | 'mist' | 'rotate' | 'check' | 'repot' | 'fertilize' | 'prune' | 'custom'

export type CalendarMoisture = 'dry' | 'balanced' | 'wet' | 'frost'

export type CompletedTaskMap = Record<string, true>

export type CalendarTask = {
  id: string
  type: CalendarTaskType
  title: string
  plant: Plant
  time: string
  completed: boolean
}

export type UserCalendarTask = {
  id: string
  type: CalendarTaskType
  title: string
  plantKind: PlantKind
  time: string
}

export type UserCalendarTaskMap = Record<string, UserCalendarTask[]>

export type CalendarDay = {
  date: number
  inMonth: boolean
  isSunday: boolean
  isToday?: boolean
  isSelected?: boolean
  moisture: CalendarMoisture
  growth: 0 | 1 | 2 | 3
  density: 0 | 1 | 2 | 3
  plants: Plant[]
  tasks: CalendarTask[]
}

export const weekdays = ['월', '화', '수', '목', '금', '토', '일']

export const seasonOrder: Season[] = ['spring', 'summer', 'autumn', 'winter']

export const defaultSelectedDateBySeason: Record<Season, number> = {
  spring: 17,
  summer: 3,
  autumn: 13,
  winter: 25,
}

export function getCalendarDateKey(season: Season, date: number) {
  return `${season}-${date}`
}

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

export function getCalendarDays(
  season: Season,
  selectedDate: number,
  completedTaskIds: CompletedTaskMap = {},
  userTasksByDate: UserCalendarTaskMap = {},
): CalendarDay[] {
  const startIndex = season === 'winter' ? 6 : season === 'autumn' ? 1 : 0
  const daysInMonth = season === 'spring' ? 30 : 31
  const today = defaultSelectedDateBySeason[season]

  return dayNumbersBySeason[season].slice(0, 42).map((date, index) => {
    const inMonth = index >= startIndex && index < startIndex + daysInMonth
    const density = (inMonth ? ((index + date) % 4) : 0) as CalendarDay['density']
    const plantCount = inMonth ? Math.max(1, Math.min(3, density + 1)) : 1
    const offset = (index + date) % plants.length
    const dayPlants = Array.from({ length: plantCount }, (_, plantIndex) => plants[(offset + plantIndex) % plants.length])
    const tasks = createDayTasks(season, date, index, inMonth, dayPlants, completedTaskIds, userTasksByDate)
    const hasPendingWatering = tasks.some((task) => task.type === 'watering' && !task.completed)

    return {
      date,
      inMonth,
      isSunday: index % 7 === 6,
      isToday: inMonth && date === today,
      isSelected: inMonth && date === selectedDate,
      moisture: season === 'winter' ? 'frost' : hasPendingWatering ? 'dry' : 'balanced',
      growth: ((index + date) % 4) as CalendarDay['growth'],
      density,
      plants: dayPlants,
      tasks,
    }
  })
}

export function getPlantMoisture(day: CalendarDay, plant: Plant): CalendarMoisture {
  const wateringTask = day.tasks.find((task) => task.type === 'watering' && task.plant.kind === plant.kind)

  if (!wateringTask) {
    return day.moisture === 'frost' ? 'frost' : 'balanced'
  }

  return wateringTask.completed ? 'wet' : day.moisture === 'frost' ? 'frost' : 'dry'
}

function createDayTasks(
  season: Season,
  date: number,
  index: number,
  inMonth: boolean,
  dayPlants: Plant[],
  completedTaskIds: CompletedTaskMap,
  userTasksByDate: UserCalendarTaskMap,
): CalendarTask[] {
  if (!inMonth) {
    return []
  }

  const tasks: Omit<CalendarTask, 'id' | 'completed'>[] = []
  const firstPlant = dayPlants[0]
  const secondPlant = dayPlants[1] ?? dayPlants[0]

  if ((date + index) % 3 !== 1) {
    tasks.push({
      type: 'watering',
      title: '물주기',
      plant: firstPlant,
      time: season === 'summer' ? '오전 8:30' : season === 'winter' ? '오전 10:30' : '오전 9:00',
    })
  }

  if (season === 'summer' && (date + index) % 4 === 0) {
    tasks.push({
      type: 'mist',
      title: '잎 분무',
      plant: secondPlant,
      time: '오후 4:00',
    })
  }

  if ((date + index) % 5 === 0) {
    tasks.push({
      type: 'rotate',
      title: '화분 돌리기',
      plant: secondPlant,
      time: '오후 1:00',
    })
  }

  if ((date + index) % 7 === 0) {
    tasks.push({
      type: 'check',
      title: '상태 확인',
      plant: firstPlant,
      time: '오후 6:00',
    })
  }

  const scheduledTasks = tasks.map((task) => {
    const id = `${season}-${date}-${task.type}-${task.plant.kind}`

    return {
      ...task,
      id,
      completed: completedTaskIds[id] === true,
    }
  })

  const userTasks = (userTasksByDate[getCalendarDateKey(season, date)] ?? []).map((task) => {
    const plant = plants.find((candidate) => candidate.kind === task.plantKind) ?? firstPlant

    return {
      id: task.id,
      type: task.type,
      title: task.title,
      plant,
      time: task.time,
      completed: completedTaskIds[task.id] === true,
    }
  })

  return [...scheduledTasks, ...userTasks]
}
