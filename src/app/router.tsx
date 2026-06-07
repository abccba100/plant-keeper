import { useState, useEffect } from 'react'
import { CalendarPage } from '../pages/calendar/CalendarPage'
import { RegisterPage } from '../pages/register/RegisterPage'
import { CareInfoPage } from '../pages/care-info/CareInfoPage'
import { AnalyzePage } from '../pages/analyze/AnalyzePage'

function getPath() {
  return window.location.pathname
}

export function Router() {
  const [pathname, setPathname] = useState(getPath)

  useEffect(() => {
    const onPop = () => setPathname(getPath())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  if (pathname === '/register') return <RegisterPage />
  if (pathname === '/care-info') return <CareInfoPage />
  if (pathname === '/analyze') return <AnalyzePage />

  return <CalendarPage />
}
