import { fixtureTest, BaseTestCase } from '../utils/fixtureTest';

import { moveCursor } from '../../src/Cursor/utils';
import { CursorCoordinate } from '../../src/Cursor/types';

interface TestCase extends BaseTestCase {
  name: string;
  inputCursorCoordinate: CursorCoordinate;
  inputAmount: number;
  expectedCursorCoordinate: CursorCoordinate;
}

interface Common {
  inputLines: string[];
}

fixtureTest<TestCase, Common>('moveCursor', 'Cursor', 'moveCursor', (testCase, common) => {
  const actualCursorCoordinate = moveCursor(
    common.inputLines.join('\n'),
    testCase.inputCursorCoordinate,
    testCase.inputAmount
  );
  expect(actualCursorCoordinate).toEqual(testCase.expectedCursorCoordinate);
});
