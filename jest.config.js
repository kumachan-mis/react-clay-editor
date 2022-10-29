const path = require('path');

module.exports = {
  roots: ['<rootDir>/unittests/'],
  moduleFileExtensions: ['ts', 'js'],
  moduleNameMapper: {
    '\\.(css|less)$': '<rootDir>/jest.styleMock.ts',
  },
  verbose: true,
};
