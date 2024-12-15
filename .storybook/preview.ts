import theme from './theme';

import { Preview } from '@storybook/react';

const preview: Preview = {
  parameters: {
    docs: {
      theme,
      canvas: { sourceState: 'none' },
    },
    options: {
      storySort: {
        order: [
          'Get Started',
          ['Introduction', 'Install', 'Formatting Syntax', 'Editor', 'Viewer'],
          'API',
          ['Overview', '*'],
        ],
      },
    },
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/ } },
  },
};

export default preview;
