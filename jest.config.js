const path = require('path');

module.exports = {
  testEnvironment: 'jsdom',
  roots: ["<rootDir>/tests/", "<rootDir>/unittests/"],
  moduleFileExtensions: ['ts', 'js', 'tsx', 'jsx'],
  setupFilesAfterEnv: [path.resolve(__dirname, 'jest.setup.ts')],
  verbose: true,
};
