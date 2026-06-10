import { create } from 'zustand'

type ThemeMode = 'day' | 'night'

type ThemeStore = {
  mode: ThemeMode
  isNightMode: boolean
  setMode: (mode: ThemeMode) => void
  toggleNightMode: () => void
}

function getInitialMode(): ThemeMode {
  if (typeof window === 'undefined') return 'day'

  return window.localStorage.getItem('plant-keeper-theme') === 'night' ? 'night' : 'day'
}

const initialMode = getInitialMode()

export const useThemeStore = create<ThemeStore>((set) => ({
  mode: initialMode,
  isNightMode: initialMode === 'night',
  setMode: (mode) => {
    window.localStorage.setItem('plant-keeper-theme', mode)
    set({ mode, isNightMode: mode === 'night' })
  },
  toggleNightMode: () =>
    set((state) => {
      const mode = state.mode === 'night' ? 'day' : 'night'
      window.localStorage.setItem('plant-keeper-theme', mode)

      return { mode, isNightMode: mode === 'night' }
    }),
}))
