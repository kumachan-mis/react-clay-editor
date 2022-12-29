import theme from './theme';

export const parameters = {
  docs: { theme },
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
};
