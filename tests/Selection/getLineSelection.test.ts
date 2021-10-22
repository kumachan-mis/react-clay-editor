import { runFixtureTests, BaseTestCase } from '../fixture';

import { getLineSelection, getSelectedText } from '../../src/Selection/utils';
import { CursorCoordinate } from '../../src/Cursor/types';

interface TestCase extends BaseTestCase {
  name: string;
  inputCursorCoordinate: CursorCoordinate | undefined;
  expectedText: string;
}

interface Common {
  inputLines: string[];
}

describe('function getLineSelection in Selection', () => {
  runFixtureTests<TestCase, Common>('Selection', 'getLineSelection', (testCase, common) => {
    const text = common.inputLines.join('\n');
    const actualSelection = getLineSelection(text, testCase.inputCursorCoordinate);
    const actualText = getSelectedText(text, actualSelection);
    expect(actualText).toEqual(testCase.expectedText);
  });
});
