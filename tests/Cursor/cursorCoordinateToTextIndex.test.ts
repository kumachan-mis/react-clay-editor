import { runFixtureTests, BaseTestCase } from '../fixture';

import { cursorCoordinateToTextIndex } from '../../src/Cursor/utils';
import { CursorCoordinate } from '../../src/Cursor/types';

interface TestCase extends BaseTestCase {
  name: string;
  inputLines: string[];
  inputCursorCoordinate: CursorCoordinate;
  expectedIndex: number;
}

describe('function cursorCoordinateToTextIndex in Cursor', () => {
  runFixtureTests<TestCase>('Cursor', 'cursorCoordinateToTextIndex', (testCase) => {
    const actualIndex = cursorCoordinateToTextIndex(testCase.inputLines.join('\n'), testCase.inputCursorCoordinate);
    expect(actualIndex).toEqual(testCase.expectedIndex);
  });
});
