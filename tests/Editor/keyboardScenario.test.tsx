import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { KeyboardTest, EditorState, defaultInitState } from './components/KeyboardTest';
import { scenariotest } from '../utils/scenario';
import { BaseTestScenario } from '../utils/scenario/types';
import { OperatingSystem, OperatingSystemEnvironment } from '../utils/osenv';

interface TestScenario extends BaseTestScenario {
  testName: string;
  os: OperatingSystem;
  inputLines: string[];
  inputState: Partial<EditorState>;
  inputTypingLines: string[];
  expectedLines: string[];
  expectedState: EditorState;
}

scenariotest<TestScenario>('keyboard event', 'Editor', 'keyboardScenario', (testScenario) => {
  const originalUserAgent = window.navigator.userAgent;
  const initState = { ...defaultInitState, ...testScenario.inputState };
  const expectedLinesAndState = {
    lines: testScenario.expectedLines,
    ...testScenario.expectedState,
  };

  Object.defineProperty(window.navigator, 'userAgent', {
    value: OperatingSystemEnvironment.userAgent[testScenario.os],
    configurable: true,
  });
  render(<KeyboardTest initText={testScenario.inputLines.join('\n')} initState={initState} />);
  const editor = screen.getByRole('textbox');

  userEvent.type(editor, testScenario.inputTypingLines.join(''));
  for (const [key, value] of Object.entries(expectedLinesAndState)) {
    expect(screen.getByText(`${key}:${JSON.stringify(value)}`)).toBeInTheDocument();
  }

  Object.defineProperty(window.navigator, 'userAgent', {
    value: originalUserAgent,
    configurable: true,
  });
});
