import { unittest } from '../unittest';
import { BaseTestCase } from '../unittest/types';

import { getWordSelection } from '../../src/Selection/utils';
import { TextSelection } from '../../src/Selection/types';
import { CursorCoordinate } from '../../src/Cursor/types';

interface TestCase extends BaseTestCase {
  testName: string;
  inputLines: string[];
  inputCursorCoordinate: CursorCoordinate | undefined;
  expectedSelection: TextSelection | undefined;
}

unittest<TestCase>('function', 'Selection', 'getWordSelection', (_, testCase) => {
  const actualCursorCoordinate = getWordSelection(
    testCase.inputLines.join('\n'),
    testCase.inputCursorCoordinate
  );
  expect(actualCursorCoordinate).toEqual(testCase.expectedSelection);
});
