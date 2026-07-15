import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import App from './App.tsx'
import { LandingPage } from './components/LandingPage.tsx'
import { InterceptorTestPage } from './test/InterceptorTestPage.tsx'

const isTestPage = window.location.pathname.replace(/\/$/, '') === '/test'
const isExtensionPopup = window.location.protocol === 'chrome-extension:'
if (isTestPage) {
  document.documentElement.classList.add('test-page')
  document.body.classList.add('test-page')
}
if (!isTestPage && !isExtensionPopup) {
  document.documentElement.classList.add('landing-page')
  document.body.classList.add('landing-page')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isTestPage ? <InterceptorTestPage /> : isExtensionPopup ? <App /> : <LandingPage />}
  </StrictMode>,
)
