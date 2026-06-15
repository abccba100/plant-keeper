import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import {
  getCalendarMonthBySeason,
  getCalendarDateKey,
  getCalendarMonthInfo,
  getCurrentCalendarMonth,
  getCurrentSeason,
  getSeasonForMonthIndex,
  seasonOrder,
  type CalendarTaskType,
  type CompletedTaskMap,
  type Season,
  type UserCalendarTaskMap,
} from './calendarData'
import type { PlantId, PlantKind } from './plantData'

type AddCalendarTaskInput = {
  year: number
  monthIndex: number
  date: number
  type: CalendarTaskType
  title: string
  plantId?: PlantId
  plantKind: PlantKind
  time: string
}

type CalendarStore = {
  season: Season
  visibleYear: number
  visibleMonthIndex: number
  selectedDate: number
  showDetail: boolean
  completedTaskIds: CompletedTaskMap
  userTasksByDate: UserCalendarTaskMap
  memosByDate: Record<string, string>
  lastCompletedTaskId?: string
  moveVisibleMonth: (monthOffset: -1 | 1) => void
  selectSeason: (season: Season) => void
  selectToday: () => void
  selectDate: (date: number) => void
  selectCalendarDate: (year: number, monthIndex: number, date: number) => void
  addTask: (task: AddCalendarTaskInput) => void
  completeTask: (taskId: string) => void
  setMemo: (year: number, monthIndex: number, date: number, memo: string) => void
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
const initialCalendarMonth = getCalendarMonthBySeason(initialSeason)
const initialCalendarInfo = getCalendarMonthInfo(initialCalendarMonth)

function getNextCalendarMonth(year: number, monthIndex: number, monthOffset: -1 | 1) {
  const nextMonth = new Date(year, monthIndex + monthOffset, 1)

  return {
    year: nextMonth.getFullYear(),
    monthIndex: nextMonth.getMonth(),
  }
}

export const useCalendarStore = create<CalendarStore>()(
  persist(
    (set) => ({
      season: initialCalendarInfo.season,
      visibleYear: initialCalendarInfo.year,
      visibleMonthIndex: initialCalendarInfo.monthIndex,
      selectedDate: initialCalendarInfo.selectedDate,
      showDetail: false,
      completedTaskIds: {},
      userTasksByDate: {},
      memosByDate: {},
      moveVisibleMonth: (monthOffset) =>
        set((state) => {
          const nextMonth = getNextCalendarMonth(state.visibleYear, state.visibleMonthIndex, monthOffset)
          const nextCalendarInfo = getCalendarMonthInfo(nextMonth, state.selectedDate)

          return {
            season: nextCalendarInfo.season,
            visibleYear: nextCalendarInfo.year,
            visibleMonthIndex: nextCalendarInfo.monthIndex,
            selectedDate: nextCalendarInfo.selectedDate,
            showDetail: false,
          }
        }),
      selectSeason: (season) =>
        set(() => {
          const nextMonth = getCalendarMonthBySeason(season)
          const nextCalendarInfo = getCalendarMonthInfo(nextMonth)

          return {
            season: nextCalendarInfo.season,
            visibleYear: nextCalendarInfo.year,
            visibleMonthIndex: nextCalendarInfo.monthIndex,
            selectedDate: nextCalendarInfo.selectedDate,
            showDetail: false,
          }
        }),
      selectToday: () =>
        set(() => {
          const todayMonth = getCurrentCalendarMonth()
          const today = new Date()

          return {
            season: getSeasonForMonthIndex(todayMonth.monthIndex),
            visibleYear: todayMonth.year,
            visibleMonthIndex: todayMonth.monthIndex,
            selectedDate: today.getDate(),
            showDetail: false,
          }
        }),
      selectDate: (date) => set({ selectedDate: date, showDetail: true }),
      selectCalendarDate: (year, monthIndex, date) =>
        set({
          season: getSeasonForMonthIndex(monthIndex),
          visibleYear: year,
          visibleMonthIndex: monthIndex,
          selectedDate: date,
          showDetail: true,
        }),
      addTask: (task) =>
        set((state) => {
          const dateKey = getCalendarDateKey(task.year, task.monthIndex, task.date)
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
      setMemo: (year, monthIndex, date, memo) =>
        set((state) => ({
          memosByDate: {
            ...state.memosByDate,
            [getCalendarDateKey(year, monthIndex, date)]: memo,
          },
        })),
      closeDetail: () => set({ showDetail: false }),
    }),
    {
      name: 'plant-keeper-calendar',
      storage: createJSONStorage(() => window.localStorage),
      partialize: (state) => ({
        season: state.season,
        visibleYear: state.visibleYear,
        visibleMonthIndex: state.visibleMonthIndex,
        selectedDate: state.selectedDate,
        completedTaskIds: state.completedTaskIds,
        userTasksByDate: state.userTasksByDate,
        memosByDate: state.memosByDate,
      }),
      version: 2,
      migrate: (persistedState) => {
        const previousState = persistedState as Partial<CalendarStore>
        const season =
          previousState.season && seasonOrder.includes(previousState.season)
            ? previousState.season
            : initialCalendarInfo.season
        const defaultMonth = getCalendarMonthBySeason(season)
        const visibleYear = previousState.visibleYear ?? defaultMonth.year
        const visibleMonthIndex = previousState.visibleMonthIndex ?? defaultMonth.monthIndex
        const calendarInfo = getCalendarMonthInfo({ year: visibleYear, monthIndex: visibleMonthIndex }, previousState.selectedDate)

        return {
          ...previousState,
          season: calendarInfo.season,
          visibleYear: calendarInfo.year,
          visibleMonthIndex: calendarInfo.monthIndex,
          selectedDate: calendarInfo.selectedDate,
          showDetail: false,
        }
      },
    },
  ),
)
