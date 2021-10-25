import { runFixtureTests, BaseTestCase } from '../fixture';

import { getSelectionText } from '../../src/Selection/utils';
import { TextSelection } from '../../src/Selection/types';

interface TestCase extends BaseTestCase {
  name: string;
  inputSelection: TextSelection | undefined;
  expectedSelectionLines: string[];
}

interface Common {
  inputLines: string[];
}

describe('function getSelectionText in Selection', () => {
  runFixtureTests<TestCase, Common>('Selection', 'getSelectionText', (testCase, common) => {
    const actualText = getSelectionText(common.inputLines.join('\n'), testCase.inputSelection);
    expect(actualText).toBe(testCase.expectedSelectionLines.join('\n'));
  });
});