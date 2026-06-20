import { plants, type Plant, type PlantId, type PlantKind } from './plantData'

export type Season = 'spring' | 'summer' | 'autumn' | 'winter'

export type CalendarMonth = {
  year: number
  monthIndex: number
}

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
  plantId?: PlantId
  plantKind: PlantKind
  time: string
}

export type UserCalendarTaskMap = Record<string, UserCalendarTask[]>

export type CalendarDay = {
  year: number
  monthIndex: number
  dateKey: string
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

type ScheduledTask = {
  type: CalendarTaskType
  title: string
  plant: Plant
  time: string
}

const representativeMonthBySeason: Record<Season, number> = {
  spring: 3,
  summer: 6,
  autumn: 9,
  winter: 11,
}

function getSeasonForDate(date: Date): Season {
  const month = date.getMonth()

  return getSeasonForMonthIndex(month)
}

export function getSeasonForMonthIndex(monthIndex: number): Season {
  const month = ((monthIndex % 12) + 12) % 12

  if (month >= 2 && month <= 4) return 'spring'
  if (month >= 5 && month <= 7) return 'summer'
  if (month >= 8 && month <= 10) return 'autumn'
  return 'winter'
}

export function getCurrentSeason(now = new Date()) {
  return getSeasonForDate(now)
}

export function getCurrentCalendarMonth(now = new Date()): CalendarMonth {
  return {
    year: now.getFullYear(),
    monthIndex: now.getMonth(),
  }
}

export function getCalendarMonthBySeason(season: Season, now = new Date()): CalendarMonth {
  const currentSeason = getSeasonForDate(now)

  return {
    year: now.getFullYear(),
    monthIndex: currentSeason === season ? now.getMonth() : representativeMonthBySeason[season],
  }
}

function formatDateKey(year: number, monthIndex: number, date: number) {
  return `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`
}

function getGridStart(year: number, monthIndex: number) {
  const firstDay = new Date(year, monthIndex, 1)
  const mondayOffset = (firstDay.getDay() + 6) % 7
  return new Date(year, monthIndex, 1 - mondayOffset)
}

export type CalendarMonthInfo = {
  year: number
  monthIndex: number
  season: Season
  daysInMonth: number
  gridStart: Date
  initialDate: string
  gridStartDate: string
  monthLabel: string
  selectedDate: number
  todayDate?: number
  isCurrentMonth: boolean
  isCurrentSeason: boolean
}

export function getCalendarMonthInfo(calendarMonth: CalendarMonth, selectedDate?: number, now = new Date()): CalendarMonthInfo {
  const { year, monthIndex } = calendarMonth
  const season = getSeasonForMonthIndex(monthIndex)
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const gridStart = getGridStart(year, monthIndex)
  const isCurrentMonth = now.getFullYear() === year && now.getMonth() === monthIndex
  const todayDate = isCurrentMonth ? now.getDate() : undefined
  const defaultSelectedDate = todayDate ?? Math.min(defaultSelectedDateBySeason[season], daysInMonth)
  const safeSelectedDate = Math.min(selectedDate ?? defaultSelectedDate, daysInMonth)

  return {
    year,
    monthIndex,
    season,
    daysInMonth,
    gridStart,
    initialDate: formatDateKey(year, monthIndex, 1),
    gridStartDate: formatDateKey(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate()),
    monthLabel: `${year}년 ${monthIndex + 1}월`,
    selectedDate: safeSelectedDate,
    todayDate,
    isCurrentMonth,
    isCurrentSeason: getSeasonForDate(now) === season,
  }
}

export function getCalendarDateKey(year: number, monthIndex: number, date: number) {
  return formatDateKey(year, monthIndex, date)
}

export const seasonMeta: Record<
  Season,
  {
    label: string
    tipTitle: string
    tip: string
  }
> = {
  spring: {
    label: '봄',
    tipTitle: '봄 관리 팁',
    tip: '새싹이 자라는 계절이에요. 햇빛과 통풍을 충분히 해주고, 분갈이와 영양제 관리도 함께 해주세요.',
  },
  summer: {
    label: '여름',
    tipTitle: '여름 관리 팁',
    tip: '습도가 높아 과습에 주의하세요. 통풍이 잘 되는 환경을 유지해주세요.',
  },
  autumn: {
    label: '가을',
    tipTitle: '가을 관리 팁',
    tip: '일교차가 커지는 계절이에요. 과습에 주의하고 통풍을 잘 유지해주세요.',
  },
  winter: {
    label: '겨울',
    tipTitle: '겨울 관리 팁',
    tip: '실내 습도를 유지하고 찬바람을 피해 주세요. 식물의 성장 속도가 느려지는 시기입니다.',
  },
}

export function getCalendarDays(
  calendarMonth: CalendarMonth,
  selectedDate: number,
  completedTaskIds: CompletedTaskMap = {},
  userTasksByDate: UserCalendarTaskMap = {},
  availablePlants: Plant[] = plants,
): CalendarDay[] {
  const calendarInfo = getCalendarMonthInfo(calendarMonth, selectedDate)
  const season = calendarInfo.season
  const plantCatalog = availablePlants.length > 0 ? availablePlants : plants

  return Array.from({ length: 42 }, (_, index) => {
    const currentDate = new Date(calendarInfo.gridStart)
    currentDate.setDate(calendarInfo.gridStart.getDate() + index)
    const date = currentDate.getDate()
    const inMonth = currentDate.getFullYear() === calendarInfo.year && currentDate.getMonth() === calendarInfo.monthIndex
    const dateKey = getCalendarDateKey(currentDate.getFullYear(), currentDate.getMonth(), date)
    const density = getDayDensity(index, date, inMonth)
    const dayPlants = getDayPlants(plantCatalog, index, date, density, inMonth)
    const tasks = createDayTasks(season, dateKey, date, index, inMonth, dayPlants, completedTaskIds, userTasksByDate, plantCatalog)

    return {
      year: currentDate.getFullYear(),
      monthIndex: currentDate.getMonth(),
      dateKey,
      date,
      inMonth,
      isSunday: currentDate.getDay() === 0,
      isToday: inMonth && date === calendarInfo.todayDate,
      isSelected: inMonth && date === selectedDate,
      moisture: getDayMoisture(season, tasks),
      growth: getDayGrowth(index, date),
      density,
      plants: dayPlants,
      tasks,
    }
  })
}

export function getPlantMoisture(day: CalendarDay, plant: Plant): CalendarMoisture {
  const wateringTask = day.tasks.find((task) => task.type === 'watering' && task.plant.id === plant.id)

  if (!wateringTask) {
    return getMoistureWithoutWatering(day.moisture)
  }

  if (wateringTask.completed) {
    return 'wet'
  }

  if (day.moisture === 'frost') {
    return 'frost'
  }

  return 'dry'
}

function getDayMoisture(season: Season, tasks: CalendarTask[]): CalendarMoisture {
  if (season === 'winter') {
    return 'frost'
  }

  const hasPendingWatering = tasks.some((task) => task.type === 'watering' && !task.completed)

  return hasPendingWatering ? 'dry' : 'balanced'
}

function getMoistureWithoutWatering(dayMoisture: CalendarMoisture): CalendarMoisture {
  if (dayMoisture === 'frost') {
    return 'frost'
  }

  return 'balanced'
}

function getDayDensity(index: number, date: number, inMonth: boolean): CalendarDay['density'] {
  if (!inMonth) {
    return 0
  }

  const value = (index + date) % 4

  if (value === 1) return 1
  if (value === 2) return 2
  if (value === 3) return 3
  return 0
}

function getDayGrowth(index: number, date: number): CalendarDay['growth'] {
  const value = (index + date) % 4

  if (value === 1) return 1
  if (value === 2) return 2
  if (value === 3) return 3
  return 0
}

function getDayPlants(plantCatalog: Plant[], index: number, date: number, density: CalendarDay['density'], inMonth: boolean) {
  const plantCount = inMonth ? Math.max(1, Math.min(3, density + 1)) : 1
  const offset = (index + date) % plantCatalog.length

  return Array.from({ length: plantCount }, (_, plantIndex) => plantCatalog[(offset + plantIndex) % plantCatalog.length])
}

function createDayTasks(
  season: Season,
  dateKey: string,
  date: number,
  index: number,
  inMonth: boolean,
  dayPlants: Plant[],
  completedTaskIds: CompletedTaskMap,
  userTasksByDate: UserCalendarTaskMap,
  plantCatalog: Plant[],
): CalendarTask[] {
  if (!inMonth) {
    return []
  }

  const scheduledTasks = createScheduledTasks(season, dateKey, date, index, dayPlants, completedTaskIds)
  const userTasks = createUserTasks(dateKey, dayPlants[0], completedTaskIds, userTasksByDate, plantCatalog)

  return [...scheduledTasks, ...userTasks]
}

function createScheduledTasks(
  season: Season,
  dateKey: string,
  date: number,
  index: number,
  dayPlants: Plant[],
  completedTaskIds: CompletedTaskMap,
) {
  const tasks: ScheduledTask[] = []
  const firstPlant = dayPlants[0]
  const secondPlant = dayPlants[1] ?? dayPlants[0]

  if ((date + index) % 3 !== 1) {
    tasks.push({
      type: 'watering',
      title: '물주기',
      plant: firstPlant,
      time: getWateringTime(season),
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

  return tasks.map((task) => {
    const id = `${dateKey}-${task.type}-${task.plant.id}`

    return {
      ...task,
      id,
      completed: completedTaskIds[id] === true,
    }
  })
}

function createUserTasks(
  dateKey: string,
  fallbackPlant: Plant,
  completedTaskIds: CompletedTaskMap,
  userTasksByDate: UserCalendarTaskMap,
  plantCatalog: Plant[],
) {
  return (userTasksByDate[dateKey] ?? []).map((task) => {
    const plant = findTaskPlant(task, plantCatalog, fallbackPlant)

    return {
      id: task.id,
      type: task.type,
      title: task.title,
      plant,
      time: task.time,
      completed: completedTaskIds[task.id] === true,
    }
  })
}

function findTaskPlant(task: UserCalendarTask, plantCatalog: Plant[], fallbackPlant: Plant) {
  return (
    plantCatalog.find((candidate) => candidate.id === task.plantId) ??
    plantCatalog.find((candidate) => candidate.kind === task.plantKind) ??
    plants.find((candidate) => candidate.id === task.plantId) ??
    plants.find((candidate) => candidate.kind === task.plantKind) ??
    fallbackPlant
  )
}

function getWateringTime(season: Season) {
  if (season === 'summer') {
    return '오전 8:30'
  }

  if (season === 'winter') {
    return '오전 10:30'
  }

  return '오전 9:00'
}
