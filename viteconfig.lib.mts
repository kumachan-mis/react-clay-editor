import { resolve } from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: { src: resolve('./src') },
  },
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.tsx'),
      name: 'ReactClayEditor',
      fileName: 'index',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'katex', '@emotion/react', '@emotion/styled'],
      output: {
        interop: 'auto',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          katex: 'katex',
          '@emotion/react': 'emotionReact',
          '@emotion/styled': 'emotionStyled',
        },
      },
    },
  },
});
