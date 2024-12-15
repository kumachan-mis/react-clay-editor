// @ts-ignore: json import
import packageJson from '../package.json';

import { StorybookConfig } from '@storybook/react-vite';
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
    const katexVersion = packageJson.devDependencies.katex.slice(1);
    const katexEnvSuffix = config?.NODE_ENV === 'production' ? '.min' : '';
    const STORYBOOK_KATEX_CSS = `https://cdn.jsdelivr.net/npm/katex@${katexVersion}/dist/katex${katexEnvSuffix}.css`;
    return { ...config, STORYBOOK_KATEX_CSS };
  },
  docs: {
    autodocs: false,
  },
};
export default config;
