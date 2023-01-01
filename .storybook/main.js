const path = require('path');
const packageJson = require('../package.json');

module.exports = {
  stories: ['../docs/**/*.stories.mdx', '../docs/**/*.stories.@(js|jsx|ts|tsx)'],
  staticDirs: ['../docs/public'],
  addons: ['@storybook/addon-docs', '@storybook/addon-links'],
  framework: '@storybook/react',
  env: (config) => {
    const isProduction = config.mode === 'production';
    const reactVersion = packageJson.devDependencies['react'].slice(1);
    const reactDomVersion = packageJson.devDependencies['react-dom'].slice(1);
    const katexVersion = packageJson.devDependencies['katex'].slice(1);
    const emotionReactVersion = packageJson.devDependencies['@emotion/react'].slice(1);
    const emotionStyledVersion = packageJson.devDependencies['@emotion/styled'].slice(1);

    const STORYBOOK_REACT_SRC = `https://unpkg.com/react@${reactVersion}/umd/react.${
      isProduction ? 'production.min' : 'development'
    }.js`;
    const STORYBOOK_REACT_DOM_SRC = `https://unpkg.com/react-dom@${reactDomVersion}/umd/react-dom.${
      isProduction ? 'production.min' : 'development'
    }.js`;
    const STORYBOOK_KATEX_SRC = `https://cdn.jsdelivr.net/npm/katex@${katexVersion}/dist/katex${
      isProduction ? '.min' : ''
    }.js`;
    const STORYBOOK_KATEX_CSS = `https://cdn.jsdelivr.net/npm/katex@${katexVersion}/dist/katex${
      isProduction ? '.min' : ''
    }.css`;
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
  core: {
    builder: 'webpack5',
  },
  webpackFinal: async (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      src: path.resolve(__dirname, '../src'),
    };
    config.externals = {
      ...config.externals,
      react: 'React',
      'react-dom': 'ReactDOM',
      katex: 'katex',
      '@emotion/react': 'emotionReact',
      '@emotion/styled': 'emotionStyled',
    };
    return config;
  },
};
