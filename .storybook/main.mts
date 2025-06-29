import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

import packageJson from '../package.json' with { type: 'json' };

import { StorybookConfig } from '@storybook/react-vite';
import remarkGfm from 'remark-gfm';

const nodejsRequire = createRequire(import.meta.url);

const config: StorybookConfig = {
  stories: [{ directory: '../docs' }],
  staticDirs: ['../docs/public'],
  addons: [getAbsolutePath('@storybook/addon-docs'), getAbsolutePath('@storybook/addon-links')],
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },
  env: (config) => {
    const katexVersion = packageJson.devDependencies.katex.slice(1);
    const katexEnvSuffix = config?.NODE_ENV === 'production' ? '.min' : '';
    const STORYBOOK_KATEX_CSS = `https://cdn.jsdelivr.net/npm/katex@${katexVersion}/dist/katex${katexEnvSuffix}.css`;
    return { ...config, STORYBOOK_KATEX_CSS };
  },
};

function getAbsolutePath(value: string): string {
  return dirname(nodejsRequire.resolve(join(value, 'package.json')));
}

export default config;
