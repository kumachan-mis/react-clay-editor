import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { fixtureTest, BaseTestCase } from '../utils/fixtureTest';
import { operatingSystem } from '../utils/operatingSystem';
import { Editor, EditorProps } from '../../src';
import * as editorUtilsModule from '../../src/Editor/callbacks/utils';
import * as textLinesModule from '../../src/TextLines';

interface TestCase extends BaseTestCase {
  name: string;
  inputTyping: string[];
  expectedLines: string[];
}

interface Common {
  options?: Omit<EditorProps, 'text' | 'onChangeText' | 'syntax'>;
  typingAlias?: Record<string, string[] | undefined>;
}

const MockEditor: React.FC<Omit<EditorProps, 'text' | 'onChangeText'>> = (props) => {
  const [text, setText] = React.useState('');
  return <Editor text={text} onChangeText={setText} {...props} />;
};

const MockTextLines: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div>
      {text.split('\n').map((line, i) => (
        <div key={i} data-testid={`mock-line-${i}`}>
          {line}
        </div>
      ))}
    </div>
  );
};

function createTest(
  syntax: 'bracket' | 'markdown',
  os?: 'windows' | 'macos'
): (testCase: TestCase, common: Common | undefined) => void {
  return (testCase, common) => {
    const originalUserAgent = window.navigator.userAgent;
    if (os) {
      const userAgent = operatingSystem.userAgent[os];
      Object.defineProperty(window.navigator, 'userAgent', { value: userAgent, configurable: true });
    }

    const SpiedTextLines = jest.spyOn(textLinesModule, 'TextLines');
    const spiedPositionToCursorCoordinate = jest.spyOn(editorUtilsModule, 'positionToCursorCoordinate');

    SpiedTextLines.mockImplementation(MockTextLines);
    spiedPositionToCursorCoordinate.mockImplementation(() => ({ lineIndex: 0, charIndex: 0 }));

    render(<MockEditor syntax={syntax} {...common?.options} />);
    userEvent.click(screen.getByTestId('editor-body'));
    userEvent.type(screen.getByRole('textbox'), resolveTypingAlias(testCase.inputTyping, common?.typingAlias).join(''));

    for (let i = 0; i < testCase.expectedLines.length; i++) {
      const line = testCase.expectedLines[i];
      expect(screen.getByTestId(`mock-line-${i}`).textContent).toBe(line);
    }
    expect(screen.queryByTestId(`mock-line-${testCase.expectedLines.length}`)).toBeNull();

    SpiedTextLines.mockRestore();
    spiedPositionToCursorCoordinate.mockRestore();

    if (os) Object.defineProperty(window.navigator, 'userAgent', { value: originalUserAgent, configurable: true });
  };
}

function resolveTypingAlias(inputTyping: string[], typingAlias?: Record<string, string[] | undefined>): string[] {
  if (!typingAlias) return inputTyping;

  const resolvedTyping: string[] = [];
  for (const typingLine of inputTyping) {
    const resolvedTypingLines = typingAlias[typingLine];
    if (!resolvedTypingLines) resolvedTyping.push(typingLine);
    else resolvedTyping.push(...resolvedTypingLines);
  }

  return resolvedTyping;
}

const bracketTest = createTest('bracket');
for (const fixtureName of ['keyboardCommon', 'keyboardBracket', 'suggestionCommon', 'suggestionBracket']) {
  fixtureTest<TestCase, Common | undefined>('keyboardEvents (bracket)', 'Editor', fixtureName, bracketTest);
}

const markdownTest = createTest('markdown');
for (const fixtureName of ['keyboardCommon', 'keyboardMarkdown', 'suggestionCommon', 'suggestionMarkdown']) {
  fixtureTest<TestCase, Common | undefined>('keyboardEvents (markdown)', 'Editor', fixtureName, markdownTest);
}

const windowsTest = createTest('bracket', 'windows');
for (const fixtureName of ['shortcutCommon', 'shortcutWindows']) {
  fixtureTest<TestCase, Common | undefined>('keyboardShortcuts (windows)', 'Editor', fixtureName, windowsTest);
}

const macosTest = createTest('bracket', 'macos');
for (const fixtureName of ['shortcutCommon', 'shortcutMacOS']) {
  fixtureTest<TestCase, Common | undefined>('keyboardShortcuts (macos)', 'Editor', fixtureName, macosTest);
}
