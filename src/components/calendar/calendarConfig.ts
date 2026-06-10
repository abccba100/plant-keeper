import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { CalendarDay, CalendarMoisture, CalendarTask, CalendarTaskType, Season } from '../../store/calendarData'

export const taskTone: Record<CalendarTask['type'], { icon: string; label: string }> = {
  watering: { icon: '◌', label: '물주기' },
  mist: { icon: '≋', label: '분무' },
  rotate: { icon: '⟳', label: '돌리기' },
  check: { icon: '✓', label: '확인' },
  repot: { icon: '▱', label: '분갈이' },
  fertilize: { icon: '✦', label: '영양제' },
  prune: { icon: '⌁', label: '가지치기' },
  custom: { icon: '+', label: '직접' },
}

export type TaskComposerValue = CalendarTaskType | 'manual'

export interface TaskComposerOption {
  value: TaskComposerValue
  calendarType: CalendarTaskType
  label: string
  title: string
  time: string
}

export const taskComposerOptions: TaskComposerOption[] = [
  { value: 'watering', calendarType: 'watering', label: '물주기', title: '물주기', time: '오전 9:00' },
  { value: 'mist', calendarType: 'mist', label: '잎 분무', title: '잎 분무', time: '오후 4:00' },
  { value: 'rotate', calendarType: 'rotate', label: '화분 돌리기', title: '화분 돌리기', time: '오후 1:00' },
  { value: 'check', calendarType: 'check', label: '상태 확인', title: '상태 확인', time: '오후 6:00' },
  { value: 'repot', calendarType: 'repot', label: '분갈이', title: '분갈이', time: '오전 10:00' },
  { value: 'fertilize', calendarType: 'fertilize', label: '영양제 주기', title: '영양제 주기', time: '오전 10:30' },
  { value: 'prune', calendarType: 'prune', label: '가지치기', title: '가지치기', time: '오후 2:00' },
  { value: 'manual', calendarType: 'custom', label: '직접 입력', title: '', time: '오전 9:00' },
]

export const leafNodes = Array.from({ length: 6 }, (_, index) => index + 1)

export const fullCalendarSeasonConfig: Record<Season, { initialDate: string; gridStart: string }> = {
  spring: { initialDate: '2024-04-01', gridStart: '2024-04-01' },
  summer: { initialDate: '2024-07-01', gridStart: '2024-07-01' },
  autumn: { initialDate: '2024-10-01', gridStart: '2024-09-30' },
  winter: { initialDate: '2024-12-01', gridStart: '2024-11-25' },
}

export const fullCalendarPlugins = [dayGridPlugin, interactionPlugin]

export function getCellPlantSlot(total: number, index: number) {
  return (total === 1 ? [50] : total === 2 ? [36, 64] : [27, 52, 73])[index] ?? 50
}

export function getDetailPlantSlot(total: number, index: number) {
  return (total === 1 ? [50] : total === 2 ? [35, 65] : [24, 52, 78])[index] ?? 50
}

export function getBaseMoisture(season: Season): CalendarMoisture {
  return season === 'winter' ? 'frost' : 'balanced'
}

export function withMoisture(day: CalendarDay, moisture: CalendarMoisture): CalendarDay {
  return { ...day, moisture }
}

export function getDayOffset(startDateKey: string, date: Date) {
  const [startYear, startMonth, startDay] = startDateKey.split('-').map(Number)
  const startUtc = Date.UTC(startYear, startMonth - 1, startDay)
  const dateUtc = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())

  return Math.round((dateUtc - startUtc) / 86_400_000)
}

export function getFullCalendarDay(season: Season, days: CalendarDay[], date: Date) {
  const offset = getDayOffset(fullCalendarSeasonConfig[season].gridStart, date)

  return offset >= 0 && offset < days.length ? days[offset] : undefined
}
