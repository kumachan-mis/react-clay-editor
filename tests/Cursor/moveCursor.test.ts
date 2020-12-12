import { unittest } from '../unittest';
import { BaseTestCase } from '../unittest/types';

import { moveCursor } from '../../src/Cursor/utils';
import { CursorCoordinate } from '../../src/Cursor/types';

interface TestCase extends BaseTestCase {
  testName: string;
  inputLines: string[];
  inputCursorCoordinate: CursorCoordinate;
  inputAmount: number;
  expectedCursorCoordinate: CursorCoordinate;
}

unittest<TestCase>('Cursor', 'moveCursor', (_, testCase) => {
  const actualCursorCoordinate = moveCursor(
    testCase.inputLines.join('\n'),
    testCase.inputCursorCoordinate,
    testCase.inputAmount
  );
  expect(actualCursorCoordinate).toEqual(testCase.expectedCursorCoordinate);
});
