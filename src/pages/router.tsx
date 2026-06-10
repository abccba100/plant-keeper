import { lazy, Suspense, useState, useEffect } from 'react'
import { CalendarPage } from './calendar/CalendarPage'
import { useThemeStore } from '../store/themeStore'

// Non-calendar pages are lazy-loaded — they're not needed on the initial `/` route.
// Each dynamic import creates a separate chunk that's only fetched when navigated to.
const RegisterPage = lazy(() =>
  import('./register/RegisterPage').then((m) => ({ default: m.RegisterPage }))
)
const CareInfoPage = lazy(() =>
  import('./care-info/CareInfoPage').then((m) => ({ default: m.CareInfoPage }))
)
const AnalyzePage = lazy(() =>
  import('./analyze/AnalyzePage').then((m) => ({ default: m.AnalyzePage }))
)

function PageFallback() {
  const isNightMode = useThemeStore((state) => state.isNightMode)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: isNightMode ? '#07111f' : '#f5f3ee',
        color: isNightMode ? '#9fb2c8' : '#6b7a6b',
        fontSize: 14,
        gap: 8,
      }}
    >
      <span
        style={{
          width: 18,
          height: 18,
          border: '2px solid currentColor',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          display: 'inline-block',
          animation: 'spin 0.7s linear infinite',
        }}
      />
      불러오는 중…
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

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

  if (pathname === '/register')
    return (
      <Suspense fallback={<PageFallback />}>
        <RegisterPage />
      </Suspense>
    )
  if (pathname === '/care-info')
    return (
      <Suspense fallback={<PageFallback />}>
        <CareInfoPage />
      </Suspense>
    )
  if (pathname === '/analyze')
    return (
      <Suspense fallback={<PageFallback />}>
        <AnalyzePage />
      </Suspense>
    )

  return <CalendarPage />
}
