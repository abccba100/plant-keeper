import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import {
  getCalendarDateKey,
  getCurrentSeason,
  getDefaultSelectedDateBySeason,
  seasonOrder,
  type CalendarTaskType,
  type CompletedTaskMap,
  type Season,
  type UserCalendarTaskMap,
} from './calendarData'
import type { PlantId, PlantKind } from './plantData'

type AddCalendarTaskInput = {
  season: Season
  date: number
  type: CalendarTaskType
  title: string
  plantId?: PlantId
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
    return getCurrentSeason()
  }

  const seasonParam = new URLSearchParams(window.location.search).get('season') as Season | null

  return seasonParam && seasonOrder.includes(seasonParam) ? seasonParam : getCurrentSeason()
}

const initialSeason = getInitialSeason()

export const useCalendarStore = create<CalendarStore>()(
  persist(
    (set) => ({
      season: initialSeason,
      selectedDate: getDefaultSelectedDateBySeason(initialSeason),
      showDetail: false,
      completedTaskIds: {},
      userTasksByDate: {},
      memosByDate: {},
      setSeason: (season) =>
        set({
          season,
          selectedDate: getDefaultSelectedDateBySeason(season),
          showDetail: false,
        }),
      selectDate: (date) => set({ selectedDate: date, showDetail: true }),
      addTask: (task) =>
        set((state) => {
          const dateKey = getCalendarDateKey(task.season, task.date)
          const plantKey = task.plantId ?? task.plantKind
          const id = `${dateKey}-${task.type}-${plantKey}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

          return {
            userTasksByDate: {
              ...state.userTasksByDate,
              [dateKey]: [
                ...(state.userTasksByDate[dateKey] ?? []),
                {
                  id,
                  type: task.type,
                  title: task.title,
                  plantId: task.plantId,
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
    }),
    {
      name: 'plant-keeper-calendar',
      storage: createJSONStorage(() => window.localStorage),
      partialize: (state) => ({
        season: state.season,
        selectedDate: state.selectedDate,
        completedTaskIds: state.completedTaskIds,
        userTasksByDate: state.userTasksByDate,
        memosByDate: state.memosByDate,
      }),
      version: 1,
    },
  ),
)
