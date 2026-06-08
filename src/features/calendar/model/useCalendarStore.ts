import { create } from 'zustand'
import {
  defaultSelectedDateBySeason,
  getCalendarDateKey,
  seasonOrder,
  type CalendarTaskType,
  type CompletedTaskMap,
  type Season,
  type UserCalendarTaskMap,
} from '../../../entities/calendar/model/calendar'
import type { PlantKind } from '../../../entities/plant/model/plant'

type AddCalendarTaskInput = {
  season: Season
  date: number
  type: CalendarTaskType
  title: string
  plantKind: PlantKind
  time: string
}

type CalendarStore = {
  season: Season
  selectedDate: number
  showDetail: boolean
  completedTaskIds: CompletedTaskMap
  userTasksByDate: UserCalendarTaskMap
  memosByDate: Record<string, string>
  lastCompletedTaskId?: string
  setSeason: (season: Season) => void
  selectDate: (date: number) => void
  addTask: (task: AddCalendarTaskInput) => void
  completeTask: (taskId: string) => void
  setMemo: (season: Season, date: number, memo: string) => void
  closeDetail: () => void
}

function getInitialSeason(): Season {
  if (typeof window === 'undefined') {
    return 'spring'
  }

  const seasonParam = new URLSearchParams(window.location.search).get('season') as Season | null

  return seasonParam && seasonOrder.includes(seasonParam) ? seasonParam : 'spring'
}

const initialSeason = getInitialSeason()

export const useCalendarStore = create<CalendarStore>((set) => ({
  season: initialSeason,
  selectedDate: defaultSelectedDateBySeason[initialSeason],
  showDetail: false,
  completedTaskIds: {},
  userTasksByDate: {},
  memosByDate: {},
  setSeason: (season) =>
    set({
      season,
      selectedDate: defaultSelectedDateBySeason[season],
      showDetail: false,
    }),
  selectDate: (date) => set({ selectedDate: date, showDetail: true }),
  addTask: (task) =>
    set((state) => {
      const dateKey = getCalendarDateKey(task.season, task.date)
      const id = `${dateKey}-${task.type}-${task.plantKind}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

      return {
        userTasksByDate: {
          ...state.userTasksByDate,
          [dateKey]: [
            ...(state.userTasksByDate[dateKey] ?? []),
            {
              id,
              type: task.type,
              title: task.title,
              plantKind: task.plantKind,
              time: task.time,
            },
          ],
        },
      }
    }),
  completeTask: (taskId) =>
    set((state) => ({
      completedTaskIds: {
        ...state.completedTaskIds,
        [taskId]: true,
      },
      lastCompletedTaskId: taskId,
    })),
  setMemo: (season, date, memo) =>
    set((state) => ({
      memosByDate: {
        ...state.memosByDate,
        [getCalendarDateKey(season, date)]: memo,
      },
    })),
  closeDetail: () => set({ showDetail: false }),
}))
