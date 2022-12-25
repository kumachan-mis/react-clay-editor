import { App } from './App';

import React from 'react';
import { createRoot } from 'react-dom/client';

const container = document.getElementById('app');
const root = createRoot(container as HTMLElement);
root.render(<App />);
