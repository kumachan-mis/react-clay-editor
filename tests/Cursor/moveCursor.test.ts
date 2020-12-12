import { resolve } from 'path';
import { readFileSync } from 'fs';

import { moveCursor } from '../../src/Cursor/utils';
import { CursorCoordinate } from '../../src/Cursor/types';

interface TestFixtures {
  testCaseGroups: {
    groupName: string;
    testCases: {
      testName: string;
      inputLines: string[];
      inputCursorCoordinate: CursorCoordinate;
      inputAmount: number;
      expectedCursorCoordinate: CursorCoordinate;
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
    'moveCursor.json'
  );
  const fixtures = JSON.parse(readFileSync(fixturesFilePath, 'utf-8')) as TestFixtures;

  fixtures.testCaseGroups.forEach((group) => {
    describe(group.groupName, () => {
      group.testCases.forEach((testCase) => {
        it(testCase.testName, () => {
          const actualCursorCoordinate = moveCursor(
            testCase.inputLines.join('\n'),
            testCase.inputCursorCoordinate,
            testCase.inputAmount
          );
          expect(actualCursorCoordinate).toEqual(testCase.expectedCursorCoordinate);
        });
      });
    });
  });
});
