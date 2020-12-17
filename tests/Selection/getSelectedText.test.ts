import { unittest } from '../utils/unit';
import { BaseTestCase } from '../utils/unit/types';

import { getSelectedText } from '../../src/Selection/utils';
import { TextSelection } from '../../src/Selection/types';

interface TestCase extends BaseTestCase {
  testName: string;
  inputLines: string[];
  inputSelection: TextSelection | undefined;
  expectedText: string;
}

unittest<TestCase>('function', 'Selection', 'getSelectedText', (_, testCase) => {
  const actualText = getSelectedText(testCase.inputLines.join('\n'), testCase.inputSelection);
  expect(actualText).toBe(testCase.expectedText);
});
