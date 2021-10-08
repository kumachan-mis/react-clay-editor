import { unittest, BaseTestCase } from '../utils/unit';

import { moveCursor } from '../../src/Cursor/utils';
import { CursorCoordinate } from '../../src/Cursor/types';

interface TestCase extends BaseTestCase {
  name: string;
  inputLines: string[];
  inputCursorCoordinate: CursorCoordinate;
  inputAmount: number;
  expectedCursorCoordinate: CursorCoordinate;
}

unittest<TestCase>('moveCursor', 'Cursor', 'moveCursor', (testCase) => {
  const actualCursorCoordinate = moveCursor(
    testCase.inputLines.join('\n'),
    testCase.inputCursorCoordinate,
    testCase.inputAmount
  );
  expect(actualCursorCoordinate).toEqual(testCase.expectedCursorCoordinate);
});
