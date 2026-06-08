import { lazy, Suspense, useEffect, useState } from 'react'

const CalendarExperience = lazy(() =>
  import('../../widgets/calendar/CalendarExperience').then((module) => ({
    default: module.CalendarExperience,
  })),
)

function CalendarSpinner() {
  return (
    <div
      style={{
        display: 'grid',
        minHeight: '100vh',
        placeItems: 'center',
        background:
          'radial-gradient(circle at 74% 12%, rgba(119, 169, 91, 0.16), transparent 30%), var(--bg, #f5f3ee)',
        color: 'var(--accent, #5f8e62)',
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
            animation: 'calendarSpin 0.8s linear infinite',
          }}
        />
        캘린더를 불러오는 중
      </div>
      <style>{`@keyframes calendarSpin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export function CalendarPage() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 450)
    return () => window.clearTimeout(id)
  }, [])

  return ready ? (
    <Suspense fallback={<CalendarSpinner />}>
      <CalendarExperience />
    </Suspense>
  ) : (
    <CalendarSpinner />
  )
}
