import { fixtureTest, BaseTestCase } from '../utils/fixtureTest';

import { getSelectedText } from '../../src/Selection/utils';
import { TextSelection } from '../../src/Selection/types';

interface TestCase extends BaseTestCase {
  name: string;
  inputSelection: TextSelection | undefined;
  expectedText: string;
}

interface Common {
  inputLines: string[];
}

fixtureTest<TestCase, Common>('getSelectedText', 'Selection', 'getSelectedText', (testCase, common) => {
  const actualText = getSelectedText(common.inputLines.join('\n'), testCase.inputSelection);
  expect(actualText).toBe(testCase.expectedText);
});
