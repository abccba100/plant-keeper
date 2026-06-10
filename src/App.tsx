import { AppProviders } from './components/providers/AppProviders'
import { Router } from './pages/router'

function App() {
  return (
    <AppProviders>
      <Router />
    </AppProviders>
  )
}

export default App
