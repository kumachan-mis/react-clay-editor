import { runFixtureTests, BaseTestCase } from '../fixture';

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

describe('function getSelectedText in Selection', () => {
  runFixtureTests<TestCase, Common>('Selection', 'getSelectedText', (testCase, common) => {
    const actualText = getSelectedText(common.inputLines.join('\n'), testCase.inputSelection);
    expect(actualText).toBe(testCase.expectedText);
  });
});
