import { resolve } from 'path';
import { readFileSync } from 'fs';

import { cursorCoordinateToTextIndex } from '../../src/Cursor/utils';
import { CursorCoordinate } from '../../src/Cursor/types';

interface TestFixtures {
  testCaseGroups: {
    groupName: string;
    testCases: {
      testName: string;
      inputLines: string[];
      inputCursorCoordinate: CursorCoordinate;
      expectedIndex: number;
    }[];
  }[];
}

describe('Unit test of function cursorCoordinateToTextIndex', () => {
  const fixturesFilePath = resolve(
    __dirname,
    '..',
    '..',
    'test-fixtures',
    'Cursor',
    'cursorCoordinateToTextIndex.json'
  );
  const fixtures = JSON.parse(readFileSync(fixturesFilePath, 'utf-8')) as TestFixtures;

  fixtures.testCaseGroups.forEach((group) => {
    describe(group.groupName, () => {
      group.testCases.forEach((testCase) => {
        it(testCase.testName, () => {
          const actualIndex = cursorCoordinateToTextIndex(
            testCase.inputLines.join('\n'),
            testCase.inputCursorCoordinate
          );
          expect(actualIndex).toEqual(testCase.expectedIndex);
        });
      });
    });
  });
});
