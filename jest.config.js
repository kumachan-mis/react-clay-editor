const path = require('path');

module.exports = {
  preset: 'ts-jest',
  moduleFileExtensions: ['ts', 'js', 'tsx', 'jsx'],
  setupFilesAfterEnv: [path.resolve(__dirname, 'tests', 'jest.setup.ts')],
  verbose: true,
};
