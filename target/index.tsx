import { App } from './App';

import { createRoot } from 'react-dom/client';

const container = document.getElementById('app');
const root = createRoot(container as HTMLElement);
root.render(<App />);
