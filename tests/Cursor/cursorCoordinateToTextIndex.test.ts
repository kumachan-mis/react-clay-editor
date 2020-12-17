import { unittest } from '../utils/unit';
import { BaseTestCase } from '../utils/unit/types';

import { cursorCoordinateToTextIndex } from '../../src/Cursor/utils';
import { CursorCoordinate } from '../../src/Cursor/types';

interface TestCase extends BaseTestCase {
  testName: string;
  inputLines: string[];
  inputCursorCoordinate: CursorCoordinate;
  expectedIndex: number;
}

unittest<TestCase>('function', 'Cursor', 'cursorCoordinateToTextIndex', (_, testCase) => {
  const actualIndex = cursorCoordinateToTextIndex(
    testCase.inputLines.join('\n'),
    testCase.inputCursorCoordinate
  );
  expect(actualIndex).toEqual(testCase.expectedIndex);
});
