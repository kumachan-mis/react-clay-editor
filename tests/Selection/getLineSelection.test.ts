import { unittest } from '../unittest';
import { BaseTestCase } from '../unittest/types';

import { getLineSelection } from '../../src/Selection/utils';
import { TextSelection } from '../../src/Selection/types';
import { CursorCoordinate } from '../../src/Cursor/types';

interface TestCase extends BaseTestCase {
  testName: string;
  inputLines: string[];
  inputCursorCoordinate: CursorCoordinate | undefined;
  expectedSelection: TextSelection | undefined;
}

unittest<TestCase>('function', 'Selection', 'getLineSelection', (_, testCase) => {
  const actualCursorCoordinate = getLineSelection(
    testCase.inputLines.join('\n'),
    testCase.inputCursorCoordinate
  );
  expect(actualCursorCoordinate).toEqual(testCase.expectedSelection);
});
