import { unittest, BaseTestCase } from '../utils/unit';

import { cursorCoordinateToTextIndex } from '../../src/Cursor/utils';
import { CursorCoordinate } from '../../src/Cursor/types';

interface TestCase extends BaseTestCase {
  name: string;
  inputLines: string[];
  inputCursorCoordinate: CursorCoordinate;
  expectedIndex: number;
}

unittest<TestCase>('cursorCoordinateToTextIndex', 'Cursor', 'cursorCoordinateToTextIndex', (testCase) => {
  const actualIndex = cursorCoordinateToTextIndex(testCase.inputLines.join('\n'), testCase.inputCursorCoordinate);
  expect(actualIndex).toEqual(testCase.expectedIndex);
});
