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
}

const MockEditor: React.FC<Pick<EditorProps, 'syntax'>> = ({ syntax }) => {
  const [text, setText] = React.useState('');
  return <Editor text={text} onChangeText={setText} syntax={syntax} />;
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

function setupFixtureTest(): void {
  const SpiedTextLines = jest.spyOn(textLinesModule, 'TextLines');
  const spiedPositionToCursorCoordinate = jest.spyOn(editorUtilsModule, 'positionToCursorCoordinate');

  beforeAll(() => {
    SpiedTextLines.mockImplementation(MockTextLines);
    spiedPositionToCursorCoordinate.mockImplementation(() => ({ lineIndex: 0, charIndex: 0 }));
  });

  afterEach(() => {
    SpiedTextLines.mockClear();
    spiedPositionToCursorCoordinate.mockClear();
  });

  afterAll(() => {
    SpiedTextLines.mockRestore();
    spiedPositionToCursorCoordinate.mockRestore();
  });
}

fixtureTest<TestCase>(
  'keyboardEvents',
  'Editor',
  ['keyboardCommon', 'keyboardBracket'],
  (testCase) => {
    render(<MockEditor syntax="bracket" />);
    userEvent.click(screen.getByTestId('editor-body'));
    userEvent.type(screen.getByRole('textbox'), testCase.inputTyping.join(''));

    for (let i = 0; i < testCase.expectedLines.length; i++) {
      const line = testCase.expectedLines[i];
      expect(screen.getByTestId(`mock-line-${i}`)).toHaveTextContent(line, { normalizeWhitespace: false });
    }
    expect(screen.queryAllByTestId(`mock-line-${testCase.expectedLines.length}`)).toBeNull();
  },
  setupFixtureTest
);

fixtureTest<TestCase>(
  'keyboardEvents',
  'Editor',
  ['keyboardCommon', 'keyboardMarkdown'],
  (testCase) => {
    render(<MockEditor syntax="markdown" />);
    userEvent.click(screen.getByTestId('editor-body'));
    userEvent.type(screen.getByRole('textbox'), testCase.inputTyping.join(''));

    for (let i = 0; i < testCase.expectedLines.length; i++) {
      const line = testCase.expectedLines[i];
      expect(screen.getByTestId(`mock-line-${i}`)).toHaveTextContent(line, { normalizeWhitespace: false });
    }
    expect(screen.queryAllByTestId(`mock-line-${testCase.expectedLines.length}`)).toBeNull();
  },
  setupFixtureTest
);
