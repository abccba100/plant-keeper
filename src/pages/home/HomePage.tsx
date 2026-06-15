import { lazy, Suspense, useEffect, useState } from 'react'
import { useThemeStore } from '../../store/themeStore'

const DailyView = lazy(() =>
  import('../../components/home/DailyView').then((m) => ({ default: m.DailyView })),
)

function HomeSpinner() {
  const isNightMode = useThemeStore((state) => state.isNightMode)

  return (
    <div
      style={{
        display: 'grid',
        minHeight: '100vh',
        placeItems: 'center',
        background: isNightMode
          ? 'radial-gradient(circle at 74% 12%, rgba(127, 168, 255, 0.12), transparent 30%), linear-gradient(118deg, #07111f 0%, #0e1829 48%, #050b16 100%)'
          : 'radial-gradient(circle at 74% 12%, rgba(119, 169, 91, 0.16), transparent 30%), var(--bg, #f5f3ee)',
        color: isNightMode ? '#9fb2c8' : 'var(--accent, #5f8e62)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 14,
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        <span
          style={{
            width: 42,
            height: 42,
            border: '3px solid color-mix(in srgb, currentColor 20%, transparent)',
            borderTopColor: 'currentColor',
            borderRadius: '50%',
            animation: 'homeSpin 0.8s linear infinite',
          }}
        />
        불러오는 중
      </div>
      <style>{`@keyframes homeSpin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export function HomePage() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 450)
    return () => window.clearTimeout(id)
  }, [])

  return ready ? (
    <Suspense fallback={<HomeSpinner />}>
      <DailyView />
    </Suspense>
  ) : (
    <HomeSpinner />
  )
}
