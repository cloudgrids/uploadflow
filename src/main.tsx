import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { InterceptorTestPage } from './test/InterceptorTestPage.tsx'

const isTestPage = window.location.pathname.replace(/\/$/, '') === '/test'
if (isTestPage) document.body.classList.add('test-page')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isTestPage ? <InterceptorTestPage /> : <App />}
  </StrictMode>,
)
