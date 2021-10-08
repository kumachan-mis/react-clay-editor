import { fixtureTest, BaseTestCase } from '../utils/fixtureTest';

import { moveCursor } from '../../src/Cursor/utils';
import { CursorCoordinate } from '../../src/Cursor/types';

interface TestCase extends BaseTestCase {
  name: string;
  inputLines: string[];
  inputCursorCoordinate: CursorCoordinate;
  inputAmount: number;
  expectedCursorCoordinate: CursorCoordinate;
}

fixtureTest<TestCase>('moveCursor', 'Cursor', 'moveCursor', (testCase) => {
  const actualCursorCoordinate = moveCursor(
    testCase.inputLines.join('\n'),
    testCase.inputCursorCoordinate,
    testCase.inputAmount
  );
  expect(actualCursorCoordinate).toEqual(testCase.expectedCursorCoordinate);
});
