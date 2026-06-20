import { lazy, Suspense, useEffect, useState } from 'react'
import { useThemeStore } from '../store/themeStore'

// All pages are lazy-loaded for separate code-split chunks.
const HomePage = lazy(() =>
  import('./home/HomePage').then((module) => ({ default: module.HomePage }))
)
const CalendarPage = lazy(() =>
  import('./calendar/CalendarPage').then((module) => ({ default: module.CalendarPage }))
)
const RegisterPage = lazy(() =>
  import('./register/RegisterPage').then((module) => ({ default: module.RegisterPage }))
)
const AnalyzePage = lazy(() =>
  import('./analyze/AnalyzePage').then((module) => ({ default: module.AnalyzePage }))
)

const KNOWN_PATHS = ['/', '/calendar', '/register', '/analyze']

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
      불러오는 중
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

function getPath() {
  return window.location.pathname
}

function isKnownPath(pathname: string) {
  return KNOWN_PATHS.includes(pathname)
}

export function Router() {
  const [pathname, setPathname] = useState(getPath)

  useEffect(() => {
    const onPop = () => setPathname(getPath())

    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => {
    if (!isKnownPath(pathname)) {
      window.history.replaceState({}, '', '/')
    }
  }, [pathname])

  const routePath = isKnownPath(pathname) ? pathname : '/'
  let Page = HomePage

  if (routePath === '/calendar') {
    Page = CalendarPage
  }

  if (routePath === '/register') {
    Page = RegisterPage
  }

  if (routePath === '/analyze') {
    Page = AnalyzePage
  }

  return (
    <Suspense fallback={<PageFallback />}>
      <Page />
    </Suspense>
  )
}
