import { CursorCoordinate } from '../../src/Cursor/types';
import { getSelectionText, getWordSelection } from '../../src/Selection/utils';
import { runFixtureTests, BaseTestCase } from '../fixture';

interface TestCase extends BaseTestCase {
  name: string;
  inputCursorCoordinate: CursorCoordinate | undefined;
  expectedSelectionLines: string[];
}

interface Common {
  inputLines: string[];
}

describe('function getWordSelection in Selection', () => {
  runFixtureTests<TestCase, Common>('Selection', 'getWordSelection', (testCase, common) => {
    const text = common.inputLines.join('\n');
    const actualSelection = getWordSelection(text, testCase.inputCursorCoordinate);
    const actualText = getSelectionText(text, actualSelection);
    expect(actualText).toEqual(testCase.expectedSelectionLines.join('\n'));
  });
});
