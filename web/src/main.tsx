import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import App from './App.tsx'
import { ErrorBoundary } from './components/layout/ErrorBoundary';

async function enableMocking() {
  const apiMode = import.meta.env.VITE_API_MODE;
  // Enable mock if VITE_API_MODE is 'mock' (default in Dockerfile for demo)
  // or if undefined in dev mode.
  if (apiMode === 'mock' || (import.meta.env.DEV && typeof apiMode === 'undefined')) {
    console.log('Starting MSW Mock Server...');
    const { worker } = await import('./mocks/browser')
    return worker.start({
      onUnhandledRequest: 'bypass',
    })
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
