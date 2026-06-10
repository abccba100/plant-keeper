import { useLayoutEffect, type PropsWithChildren } from 'react'
import { GlobalStyles } from '../styles/design-system/GlobalStyles'
import { useThemeStore } from '../../store/themeStore'

export function AppProviders({ children }: PropsWithChildren) {
  const mode = useThemeStore((state) => state.mode)

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = mode
  }, [mode])

  return (
    <>
      <GlobalStyles />
      {children}
    </>
  )
}
