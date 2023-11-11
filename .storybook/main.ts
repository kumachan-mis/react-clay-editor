import { StorybookConfig } from '@storybook/react-vite';
import packageJson from '../package.json';
import remarkGfm from 'remark-gfm';

const config: StorybookConfig = {
  stories: [{ directory: '../docs' }],
  staticDirs: ['../docs/public'],
  addons: [
    {
      name: '@storybook/addon-docs',
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
    '@storybook/addon-links',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  env: (config) => {
    const isProduction = config.NODE_ENV === 'production';

    const reactVersion = packageJson.devDependencies['react'].slice(1);
    const reactDomVersion = packageJson.devDependencies['react-dom'].slice(1);
    const katexVersion = packageJson.devDependencies['katex'].slice(1);
    const emotionReactVersion = packageJson.devDependencies['@emotion/react'].slice(1);
    const emotionStyledVersion = packageJson.devDependencies['@emotion/styled'].slice(1);

    const reactEnvSuffix = isProduction ? 'production.min' : 'development';
    const katexEnvSuffix = isProduction ? 'min' : '';

    const STORYBOOK_REACT_SRC = `https://unpkg.com/react@${reactVersion}/umd/react.${reactEnvSuffix}.js`;
    const STORYBOOK_REACT_DOM_SRC = `https://unpkg.com/react-dom@${reactDomVersion}/umd/react-dom.${reactEnvSuffix}.js`;
    const STORYBOOK_KATEX_SRC = `https://cdn.jsdelivr.net/npm/katex@${katexVersion}/dist/katex${katexEnvSuffix}.js`;
    const STORYBOOK_KATEX_CSS = `https://cdn.jsdelivr.net/npm/katex@${katexVersion}/dist/katex${katexEnvSuffix}.css`;
    const STORYBOOK_EMOTION_REACT_SRC = `https://cdn.jsdelivr.net/npm/@emotion/react@${emotionReactVersion}/dist/emotion-react.umd.min.js`;
    const STORYBOOK_EMOTION_STYLED_SRC = `https://cdn.jsdelivr.net/npm/@emotion/styled@${emotionStyledVersion}/dist/emotion-styled.umd.min.js`;
    return {
      ...config,
      STORYBOOK_REACT_SRC,
      STORYBOOK_REACT_DOM_SRC,
      STORYBOOK_KATEX_SRC,
      STORYBOOK_KATEX_CSS,
      STORYBOOK_EMOTION_REACT_SRC,
      STORYBOOK_EMOTION_STYLED_SRC,
    };
  },
  viteFinal: async (config) => {
    config.build = {
      ...config.build,
      rollupOptions: {
        ...config.build?.rollupOptions,
        external: ['react', 'react-dom', 'katex', '@emotion/react', '@emotion/styled'],
        output: {
          ...config.build?.rollupOptions?.output,
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            katex: 'katex',
            '@emotion/react': 'emotionReact',
            '@emotion/styled': 'emotionStyled',
          },
        },
      },
    };
    return config;
  },
  docs: {
    autodocs: false,
  },
};
export default config;
