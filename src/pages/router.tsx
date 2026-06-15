import { lazy, Suspense, useState, useEffect } from 'react'
import { useThemeStore } from '../store/themeStore'

// All pages are lazy-loaded for separate code-split chunks.
const HomePage = lazy(() =>
  import('./home/HomePage').then((m) => ({ default: m.HomePage }))
)
const CalendarPage = lazy(() =>
  import('./calendar/CalendarPage').then((m) => ({ default: m.CalendarPage }))
)
const RegisterPage = lazy(() =>
  import('./register/RegisterPage').then((m) => ({ default: m.RegisterPage }))
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

function isKnownPath(pathname: string) {
  return pathname === '/' || pathname === '/calendar' || pathname === '/register' || pathname === '/analyze'
}

export function Router() {
  const [pathname, setPathname] = useState(getPath)

  useEffect(() => {
    const onPop = () => setPathname(getPath())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => {
    if (isKnownPath(pathname)) return

    window.history.replaceState({}, '', '/')
  }, [pathname])

  const routePath = isKnownPath(pathname) ? pathname : '/'

  if (routePath === '/calendar')
    return (
      <Suspense fallback={<PageFallback />}>
        <CalendarPage />
      </Suspense>
    )
  if (routePath === '/register')
    return (
      <Suspense fallback={<PageFallback />}>
        <RegisterPage />
      </Suspense>
    )
  if (routePath === '/analyze')
    return (
      <Suspense fallback={<PageFallback />}>
        <AnalyzePage />
      </Suspense>
    )

  return (
    <Suspense fallback={<PageFallback />}>
      <HomePage />
    </Suspense>
  )
}
