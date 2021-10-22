import { runFixtureTests, BaseTestCase } from '../fixture';

import { getSelectedText, getWordSelection } from '../../src/Selection/utils';
import { CursorCoordinate } from '../../src/Cursor/types';

interface TestCase extends BaseTestCase {
  name: string;
  inputCursorCoordinate: CursorCoordinate | undefined;
  expectedText: string;
}

interface Common {
  inputLines: string[];
}

describe('function getWordSelection in Selection', () => {
  runFixtureTests<TestCase, Common>('Selection', 'getWordSelection', (testCase, common) => {
    const text = common.inputLines.join('\n');
    const actualSelection = getWordSelection(text, testCase.inputCursorCoordinate);
    const actualText = getSelectedText(text, actualSelection);
    expect(actualText).toEqual(testCase.expectedText);
  });
});
