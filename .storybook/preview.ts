import { Preview } from '@storybook/react';
import theme from './theme';
import prettier from 'prettier/standalone';
import prettierBabel from 'prettier/parser-babel';

const preview: Preview = {
  parameters: {
    docs: {
      theme,
      source: {
        transform: (input: string) => {
          if (input.startsWith('() => ')) {
            return prettier.format(input, { parser: 'babel', plugins: [prettierBabel] });
          }
          return input;
        },
      },
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
