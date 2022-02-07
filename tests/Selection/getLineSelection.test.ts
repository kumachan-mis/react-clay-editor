import { CursorCoordinate } from '../../src/Cursor/types';
import { getLineSelection, getSelectionText } from '../../src/Selection/utils';
import { runFixtureTests, BaseTestCase } from '../fixture';

interface TestCase extends BaseTestCase {
  name: string;
  inputCursorCoordinate: CursorCoordinate | undefined;
  expectedSelectionLines: string[];
}

interface Common {
  inputLines: string[];
}

describe('function getLineSelection in Selection', () => {
  runFixtureTests<TestCase, Common>('Selection', 'getLineSelection', (testCase, common) => {
    const text = common.inputLines.join('\n');
    const actualSelection = getLineSelection(text, testCase.inputCursorCoordinate);
    const actualText = getSelectionText(text, actualSelection);
    const expectedText = testCase.expectedSelectionLines.join('\n');
    if (!expectedText) expect(actualSelection).toBeUndefined();
    expect(actualText).toEqual(expectedText);
  });
});
