import * as React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { KeyboardTest, KeyboardTestState, defaultInitState } from './KeyboardTest';
import { unittest } from '../utils/unit';
import { BaseTestCase } from '../utils/unit/types';
import { OperatingSystem, OperatingSystemEnvironment } from '../utils/osenv';

interface TestCase extends BaseTestCase {
  testName: string;
  inputLines: string[];
  inputState: Partial<KeyboardTestState>;
  inputTypingByOS: { [os in OperatingSystem]: string };
  inputTypingForMacos: string;
  expectedLines: string[];
  expectedState: KeyboardTestState;
}

unittest<TestCase>('state transition', 'Editor', 'shortcutCommand', (_, testCase) => {
  const originalUserAgent = window.navigator.userAgent;
  const initState = { ...defaultInitState, ...testCase.inputState };
  const expectedLinesAndState = { lines: testCase.expectedLines, ...testCase.expectedState };

  for (const os of OperatingSystemEnvironment.operatingSystems) {
    Object.defineProperty(window.navigator, 'userAgent', {
      value: OperatingSystemEnvironment.userAgent[os],
      configurable: true,
    });
    render(<KeyboardTest initText={testCase.inputLines.join('\n')} initState={initState} />);
    const editor = screen.getByRole('textbox');

    userEvent.type(editor, testCase.inputTypingByOS[os]);
    for (const [key, value] of Object.entries(expectedLinesAndState)) {
      expect(screen.getByText(`${key}:${JSON.stringify(value)}`)).toBeInTheDocument();
    }

    cleanup();
  }

  Object.defineProperty(window.navigator, 'userAgent', {
    value: originalUserAgent,
    configurable: false,
  });
});
