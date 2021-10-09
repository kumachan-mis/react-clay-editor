import { fixtureTest, BaseTestCase } from '../utils/fixtureTest';

import { getSelectedText } from '../../src/Selection/utils';
import { TextSelection } from '../../src/Selection/types';

interface TestCase extends BaseTestCase {
  name: string;
  inputLines: string[];
  inputSelection: TextSelection | undefined;
  expectedText: string;
}

fixtureTest<TestCase>('getSelectedText', 'Selection', 'getSelectedText', (testCase) => {
  const actualText = getSelectedText(testCase.inputLines.join('\n'), testCase.inputSelection);
  expect(actualText).toBe(testCase.expectedText);
});
