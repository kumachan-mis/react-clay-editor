import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { KeyboardTest, KeyboardTestState, defaultInitState } from './KeyboardTest';
import { unittest } from '../utils/unit';
import { BaseTestCase } from '../utils/unit/types';

interface TestCase extends BaseTestCase {
  testName: string;
  inputLines: string[];
  inputState: Partial<KeyboardTestState>;
  inputTypingForWin: string;
  inputTypingForMac: string;
  expectedLines: string[];
  expectedState: KeyboardTestState;
}

unittest<TestCase>('state transition', 'Editor', 'shortcutCommand', (_, testCase) => {
  const originalUserAgent = window.navigator.userAgent;

  const initState = { ...defaultInitState, ...testCase.inputState };
  render(<KeyboardTest initText={testCase.inputLines.join('\n')} initState={initState} />);
  const editor = screen.getByRole('textbox');

  Object.defineProperty(window.navigator, 'userAgent', {
    value: [
      'Mozilla/5.0',
      '(Windows NT 10.0; Win64; x64)',
      'AppleWebKit/537.36 (KHTML, like Gecko)',
      'Chrome/69.0.3497.100',
    ].join(' '),
    configurable: true,
  }); // for windows
  userEvent.type(editor, testCase.inputTypingForWin);
  for (const [key, value] of Object.entries(testCase.expectedState)) {
    expect(screen.getByText(`${key}:${JSON.stringify(value)}`)).toBeInTheDocument();
  }

  Object.defineProperty(window.navigator, 'userAgent', {
    value: [
      'Mozilla/5.0',
      '(Macintosh; Intel Mac OS X 10_13_6)',
      'AppleWebKit/537.36 (KHTML, like Gecko)',
      'Chrome/69.0.3497.100 Safari/537.36',
    ].join(' '),
    configurable: true,
  }); // for mac
  userEvent.type(editor, testCase.inputTypingForMac);
  const expectedLinesAndState = { lines: testCase.expectedLines, ...testCase.expectedState };
  for (const [key, value] of Object.entries(expectedLinesAndState)) {
    expect(screen.getByText(`${key}:${JSON.stringify(value)}`)).toBeInTheDocument();
  }

  Object.defineProperty(window.navigator, 'userAgent', {
    value: originalUserAgent,
    configurable: false,
  });
});
