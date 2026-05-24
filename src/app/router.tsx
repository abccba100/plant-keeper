import { CalendarPage } from '../pages/calendar/CalendarPage'

const routes = {
  calendar: '/',
} as const

export function Router() {
  const pathname = window.location.pathname

  if (pathname === routes.calendar) {
    return <CalendarPage />
  }

  return <CalendarPage />
}
