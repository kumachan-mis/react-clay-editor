import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { fixtureTest, BaseTestCase } from '../utils/fixtureTest';
import { Editor } from '../../src';
import * as editorUtilsModule from '../../src/Editor/callbacks/utils';
import * as textLinesModule from '../../src/TextLines';

interface TestCase extends BaseTestCase {
  name: string;
  inputTyping: string;
  expectedLines: string[];
}

const MockEditor: React.FC = () => {
  const [text, setText] = React.useState('');
  return <Editor text={text} onChangeText={setText} />;
};

const MockTextLines: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div>
      {text.split('\n').map((line, key) => (
        <div key={key}>{line}</div>
      ))}
    </div>
  );
};

fixtureTest<TestCase>('keyboardEvents', 'Editor', 'keyboardOperation', (testCase) => {
  const SpiedTextLines = jest.spyOn(textLinesModule, 'TextLines');
  SpiedTextLines.mockImplementation(MockTextLines);
  const spiedPositionToCursorCoordinate = jest.spyOn(editorUtilsModule, 'positionToCursorCoordinate');
  spiedPositionToCursorCoordinate.mockImplementation(() => ({ lineIndex: 0, charIndex: 0 }));

  render(<MockEditor />);
  userEvent.click(screen.getByTestId('editor-body'));
  userEvent.type(screen.getByRole('textbox'), testCase.inputTyping);
  for (const line of testCase.expectedLines) expect(screen.getByText(line)).toBeInTheDocument();
});
