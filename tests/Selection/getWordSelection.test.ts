import { fixtureTest, BaseTestCase } from '../utils/fixtureTest';

import { getWordSelection } from '../../src/Selection/utils';
import { TextSelection } from '../../src/Selection/types';
import { CursorCoordinate } from '../../src/Cursor/types';

interface TestCase extends BaseTestCase {
  name: string;
  inputLines: string[];
  inputCursorCoordinate: CursorCoordinate | undefined;
  expectedSelection: TextSelection | undefined;
}

fixtureTest<TestCase>('getWordSelection', 'Selection', 'getWordSelection', (testCase) => {
  const actualCursorCoordinate = getWordSelection(testCase.inputLines.join('\n'), testCase.inputCursorCoordinate);
  expect(actualCursorCoordinate).toEqual(testCase.expectedSelection);
});
