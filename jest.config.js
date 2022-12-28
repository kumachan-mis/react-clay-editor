module.exports = {
  roots: ['<rootDir>/unittests/'],
  transform: { '^.+\\.(ts|tsx)$': 'ts-jest' },
  moduleNameMapper: { 'src/(.*)': '<rootDir>/src/$1' },
  moduleFileExtensions: ['ts', 'js'],
  verbose: true,
};
