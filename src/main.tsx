import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Preload Inter font for better performance
const fontPreloadLink = document.createElement('link');
fontPreloadLink.rel = 'preload';
fontPreloadLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap';
fontPreloadLink.as = 'style';
document.head.appendChild(fontPreloadLink);

// Add Inter font stylesheet
const fontStyleLink = document.createElement('link');
fontStyleLink.rel = 'stylesheet';
fontStyleLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap';
document.head.appendChild(fontStyleLink);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);