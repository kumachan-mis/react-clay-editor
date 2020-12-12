import { unittest } from '../unittest';
import { BaseTestCase } from '../unittest/types';

import { getSelectedText } from '../../src/Selection/utils';
import { TextSelection } from '../../src/Selection/types';

interface TestCase extends BaseTestCase {
  testName: string;
  inputLines: string[];
  inputTextSelection: TextSelection | undefined;
  expectedText: string;
}

unittest<TestCase>('Selection', 'getSelectedText', (_, testCase) => {
  const actualText = getSelectedText(testCase.inputLines.join('\n'), testCase.inputTextSelection);
  expect(actualText).toBe(testCase.expectedText);
});
