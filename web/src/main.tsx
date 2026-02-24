import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import App from './App.tsx'
import { ErrorBoundary } from './components/layout/ErrorBoundary';

async function enableMocking() {
  const enableMock = import.meta.env.VITE_ENABLE_MOCK;
  // Enable mock by default if VITE_ENABLE_MOCK is 'true' or undefined (demo mode)
  if (enableMock === 'true' || typeof enableMock === 'undefined') {
    const { worker } = await import('./mocks/browser')
    return worker.start()
  }
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  )
})
