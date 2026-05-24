import { AppProviders } from './app/providers/AppProviders'
import { Router } from './app/router'

function App() {
  return (
    <AppProviders>
      <Router />
    </AppProviders>
  )
}

export default App
