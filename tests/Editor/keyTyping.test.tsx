import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { KeyboardTest, KeyboardTestState, defaultInitState } from './KeyboardTest';
import { unittest } from '../unittest';
import { BaseTestCase } from '../unittest/types';

interface TestCase extends BaseTestCase {
  testName: string;
  inputState: Partial<KeyboardTestState>;
  inputTyping: string;
  expectedLines: string[];
  expectedState: KeyboardTestState;
}

unittest<TestCase>('state transition', 'Editor', 'keyTyping', (_, testCase) => {
  const initState = { ...defaultInitState, ...testCase.inputState };
  render(<KeyboardTest initState={initState} />);
  const editor = screen.getByRole('textbox');

  userEvent.type(editor, testCase.inputTyping);
  const expectedLinesAndState = { lines: testCase.expectedLines, ...testCase.expectedState };
  for (const [key, value] of Object.entries(expectedLinesAndState)) {
    expect(screen.getByText(`${key}:${JSON.stringify(value)}`)).toBeInTheDocument();
  }
});
