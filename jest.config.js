const path = require('path');

module.exports = {
  testEnvironment: 'jsdom',
  roots: ["<rootDir>/tests/", "<rootDir>/unittests/"],
  moduleFileExtensions: ['ts', 'js', 'tsx', 'jsx'],
  moduleNameMapper: {
    '\\.(css|less)$': '<rootDir>/jest.styleMock.ts',
  },
  setupFilesAfterEnv: [path.resolve(__dirname, 'jest.setup.ts')],
  verbose: true,
};
