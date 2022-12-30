const path = require('path');

module.exports = {
  stories: ['../docs/**/*.stories.mdx', '../docs/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-links'],
  framework: '@storybook/react',
  webpackFinal: async (config) => {
    config.resolve.alias = { ...config.resolve.alias, src: path.resolve(__dirname, '../src') };
    return config;
  },
};
