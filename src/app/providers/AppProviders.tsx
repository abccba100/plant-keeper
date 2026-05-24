import type { PropsWithChildren } from 'react'
import { GlobalStyles } from '../../shared/design-system/GlobalStyles'

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <>
      <GlobalStyles />
      {children}
    </>
  )
}
