import { fixtureTest, BaseTestCase } from '../utils/fixtureTest';

import { getLineSelection } from '../../src/Selection/utils';
import { TextSelection } from '../../src/Selection/types';
import { CursorCoordinate } from '../../src/Cursor/types';

interface TestCase extends BaseTestCase {
  name: string;
  inputLines: string[];
  inputCursorCoordinate: CursorCoordinate | undefined;
  expectedSelection: TextSelection | undefined;
}

fixtureTest<TestCase>('getLineSelection', 'Selection', 'getLineSelection', (testCase) => {
  const actualCursorCoordinate = getLineSelection(testCase.inputLines.join('\n'), testCase.inputCursorCoordinate);
  expect(actualCursorCoordinate).toEqual(testCase.expectedSelection);
});
