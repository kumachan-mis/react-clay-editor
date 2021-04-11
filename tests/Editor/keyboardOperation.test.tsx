import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { KeyboardTest, EditorState, defaultInitState } from './components/KeyboardTest';
import { unittest } from '../utils/unit';
import { BaseTestCase } from '../utils/unit/types';

interface TestCase extends BaseTestCase {
  testName: string;
  inputLines: string[];
  inputState: Partial<EditorState>;
  inputTyping: string;
  expectedLines: string[];
  expectedState: EditorState;
}

unittest<TestCase>('state transition', 'Editor', 'keyboardOperation', (_, testCase) => {
  const initState = { ...defaultInitState, ...testCase.inputState };
  render(<KeyboardTest initText={testCase.inputLines.join('\n')} initState={initState} />);
  const editor = screen.getByRole('textbox');

  userEvent.type(editor, testCase.inputTyping);
  const expectedLinesAndState = { lines: testCase.expectedLines, ...testCase.expectedState };
  for (const [key, value] of Object.entries(expectedLinesAndState)) {
    expect(screen.getByText(`${key}:${JSON.stringify(value)}`)).toBeInTheDocument();
  }
});
