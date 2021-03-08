const path = require('path');

module.exports = {
  preset: 'ts-jest',
  moduleFileExtensions: ['ts', 'js', 'tsx', 'jsx'],
  moduleNameMapper: {
    '\\.(css|less)$': '<rootDir>/tests/stylemock.ts',
  },
  setupFilesAfterEnv: [path.resolve(__dirname, 'tests', 'jest.setup.ts')],
  verbose: true,
};
