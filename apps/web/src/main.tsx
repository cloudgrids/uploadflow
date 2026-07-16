import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { LandingPage } from './components/LandingPage';
import { InterceptorTestPage } from './test/InterceptorTestPage';
import './index.css';

const publicPath = window.location.pathname.replace(/\/$/, '');
const isTestPage = publicPath === '/test' || publicPath === '/demo';

document.documentElement.classList.add(isTestPage ? 'test-page' : 'landing-page');
document.body.classList.add(isTestPage ? 'test-page' : 'landing-page');

createRoot(document.getElementById('root')!).render(
  <StrictMode>{isTestPage ? <InterceptorTestPage /> : <LandingPage />}</StrictMode>
);
