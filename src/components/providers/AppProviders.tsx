import type { PropsWithChildren } from 'react'
import { GlobalStyles } from '../styles/design-system/GlobalStyles'

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <>
      <GlobalStyles />
      {children}
    </>
  )
}
