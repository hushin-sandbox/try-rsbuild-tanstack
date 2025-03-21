import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';

async function enableMocking() {
  if (import.meta.env.MODE !== 'development') {
    return;
  }

  const { worker } = await import('./mocks/browser');
  const { seedTasks } = await import('./mocks/lib/seed');

  // 開発環境でのみシードデータを投入
  seedTasks();

  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}

const rootEl = document.getElementById('root');

if (rootEl) {
  enableMocking().then(() => {
    const root = ReactDOM.createRoot(rootEl);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
  });
}
