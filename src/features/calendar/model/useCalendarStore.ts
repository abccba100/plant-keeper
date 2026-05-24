import { create } from 'zustand'
import type { Season } from '../../../entities/calendar/model/calendar'

type CalendarStore = {
  season: Season
  selectedDate: number
  showDetail: boolean
  setSeason: (season: Season) => void
  selectDate: (date: number) => void
  closeDetail: () => void
}

const selectedDateBySeason: Record<Season, number> = {
  spring: 17,
  summer: 3,
  autumn: 13,
  winter: 25,
}

export const useCalendarStore = create<CalendarStore>((set) => ({
  season: 'spring',
  selectedDate: selectedDateBySeason.spring,
  showDetail: false,
  setSeason: (season) =>
    set({
      season,
      selectedDate: selectedDateBySeason[season],
      showDetail: false,
    }),
  selectDate: (date) => set({ selectedDate: date, showDetail: true }),
  closeDetail: () => set({ showDetail: false }),
}))
