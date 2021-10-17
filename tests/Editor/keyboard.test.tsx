import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { fixtureTest, BaseTestCase } from '../utils/fixtureTest';
import { Editor, EditorProps } from '../../src';
import * as editorUtilsModule from '../../src/Editor/callbacks/utils';
import * as textLinesModule from '../../src/TextLines';

interface TestCase extends BaseTestCase {
  name: string;
  inputTyping: string[];
  expectedLines: string[];
  options?: Omit<EditorProps, 'text' | 'onChangeText' | 'syntax'>;
}

interface Common {
  options?: Omit<EditorProps, 'text' | 'onChangeText' | 'syntax'>;
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

function getFixtureNames(os: 'windows' | 'macos', syntax: 'bracket' | 'markdown'): string[] {
  const fixtureNames = ['keyboardCommon', 'suggestionCommon'];

  switch (os) {
    case 'windows':
      fixtureNames.push('shortcutWindows');
      break;
    case 'macos':
      fixtureNames.push('shortcutMacOS');
      break;
    default:
      break;
  }

  switch (syntax) {
    case 'bracket':
      fixtureNames.push('keyboardBracket');
      break;
    case 'markdown':
      fixtureNames.push('keyboardMarkdown');
      break;
    default:
      break;
  }

  return fixtureNames;
}

function createTest(
  os: 'windows' | 'macos',
  syntax: 'bracket' | 'markdown'
): (testCase: TestCase, common?: Common) => void {
  return (testCase, common) => {
    const SpiedTextLines = jest.spyOn(textLinesModule, 'TextLines');
    const spiedPositionToCursorCoordinate = jest.spyOn(editorUtilsModule, 'positionToCursorCoordinate');

    SpiedTextLines.mockImplementation(MockTextLines);
    spiedPositionToCursorCoordinate.mockImplementation(() => ({ lineIndex: 0, charIndex: 0 }));

    render(<MockEditor syntax={syntax} {...common?.options} {...testCase.options} />);
    userEvent.click(screen.getByTestId('editor-body'));
    userEvent.type(screen.getByRole('textbox'), testCase.inputTyping.join(''));

    for (let i = 0; i < testCase.expectedLines.length; i++) {
      const line = testCase.expectedLines[i];
      expect(screen.getByTestId(`mock-line-${i}`)).toHaveTextContent(line, { normalizeWhitespace: false });
    }
    expect(screen.queryByTestId(`mock-line-${testCase.expectedLines.length}`)).toBeNull();

    SpiedTextLines.mockRestore();
    spiedPositionToCursorCoordinate.mockRestore();
  };
}

for (const os of ['windows', 'macos'] as const) {
  for (const syntax of ['bracket', 'markdown'] as const) {
    fixtureTest<TestCase, Common | undefined>(
      'keyboardEvents',
      'Editor',
      getFixtureNames(os, syntax),
      createTest(os, syntax)
    );
  }
}
