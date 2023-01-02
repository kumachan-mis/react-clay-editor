import { resolve } from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  root: './target',
  resolve: {
    alias: { src: resolve('./src') },
  },
  plugins: [react()],
});
