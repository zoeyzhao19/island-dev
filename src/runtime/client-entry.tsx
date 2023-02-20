import ReactDOM from 'react-dom/client';
import siteData from 'virtual:island:site-data';
import { App } from './App';

export function renderInBrowser() {
  const root = document.getElementById('root');
  if (!root) {
    throw new Error('Root element not found');
  }
  ReactDOM.createRoot(root).render(<App />);
}

renderInBrowser();
console.log(siteData);
