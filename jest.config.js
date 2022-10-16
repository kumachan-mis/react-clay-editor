const path = require('path');

module.exports = {
  testEnvironment: 'jsdom',
  roots: ["<rootDir>/unittests/"],
  moduleFileExtensions: ['ts', 'js', 'tsx', 'jsx'],
  moduleNameMapper: {
    '\\.(css|less)$': '<rootDir>/unittests/stylemock.ts',
  },
  verbose: true,
};
