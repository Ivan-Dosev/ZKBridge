import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Suppress specific Web3React chain ID errors
window.addEventListener('error', (event) => {
  if (event.error && event.error.message && (
    event.error.message.includes('chainId null is not an integer') ||
    event.error.message.includes('Invariant failed: chainId null') ||
    event.error.message.includes('normalizeChainId')
  )) {
    console.log('Suppressing chain ID error:', event.error.message);
    event.preventDefault();
    event.stopPropagation();
    return false;
  }
});

// Suppress unhandled promise rejections for chain ID errors
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && event.reason.message && (
    event.reason.message.includes('chainId null is not an integer') ||
    event.reason.message.includes('Invariant failed: chainId null') ||
    event.reason.message.includes('normalizeChainId')
  )) {
    console.log('Suppressing chain ID promise rejection:', event.reason.message);
    event.preventDefault();
    return false;
  }
});

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 