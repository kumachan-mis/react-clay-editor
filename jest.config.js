module.exports = {
  roots: ["<rootDir>/unittests/"],
  moduleFileExtensions: ['ts', 'js'],
  moduleNameMapper: {
    '\\.(css|less)$': '<rootDir>/unittests/style.mock.ts',
  },
  verbose: true,
};
