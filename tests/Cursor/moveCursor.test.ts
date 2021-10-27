import { CursorCoordinate } from '../../src/Cursor/types';
import { moveCursor } from '../../src/Cursor/utils';
import { runFixtureTests, BaseTestCase } from '../fixture';

interface TestCase extends BaseTestCase {
  name: string;
  inputCursorCoordinate: CursorCoordinate;
  inputAmount: number;
  expectedCursorCoordinate: CursorCoordinate;
}

interface Common {
  inputLines: string[];
}

describe('function moveCursor in Cursor', () => {
  runFixtureTests<TestCase, Common>('Cursor', 'moveCursor', (testCase, common) => {
    const actualCursorCoordinate = moveCursor(
      common.inputLines.join('\n'),
      testCase.inputCursorCoordinate,
      testCase.inputAmount
    );
    expect(actualCursorCoordinate).toEqual(testCase.expectedCursorCoordinate);
  });
});
