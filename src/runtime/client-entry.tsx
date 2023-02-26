import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';

export function renderInBrowser() {
  const root = document.getElementById('root');
  if (!root) {
    throw new Error('Root element not found');
  }
  ReactDOM.createRoot(root).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

renderInBrowser();
