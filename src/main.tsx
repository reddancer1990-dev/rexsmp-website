import { StrictMode, Component, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: '2rem', fontFamily: '-apple-system, sans-serif', color: '#cdd6f4', background: '#1e1e2e', minHeight: '100dvh' }}>
          <h1>Something went wrong</h1>
          <p>{this.state.error.message}</p>
          <button type="button" onClick={() => window.location.reload()} style={{ marginTop: '1rem', padding: '12px 20px', fontSize: '16px' }}>
            Reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

const rootEl = document.getElementById('root')
if (!rootEl) {
  document.body.innerHTML = '<p style="padding:2rem;font-family:sans-serif">Root element missing.</p>'
} else {
  try {
    createRoot(rootEl).render(
      <StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </StrictMode>,
    )
  } catch (err) {
    rootEl.innerHTML = `<div style="padding:2rem;font-family:sans-serif;color:#cdd6f4;background:#1e1e2e;min-height:100dvh"><h1>Failed to start</h1><p>${err instanceof Error ? err.message : 'Unknown error'}</p></div>`
  }
}
