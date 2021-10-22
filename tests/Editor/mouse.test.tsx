import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { EventType } from '@testing-library/dom';

import { fixtureTest, BaseTestCase } from '../utils/fixtureTest';
import { Editor, EditorProps } from '../../src';
import * as editorUtilsModule from '../../src/Editor/callbacks/utils';
import { TextSelection } from '../../src/Selection/types';
import { getSelectedText } from '../../src/Selection/utils';
import * as SelectionModule from '../../src/Selection';

interface TestCase extends BaseTestCase {
  name: string;
  inputEvents: {
    type: EventType;
    coordinate: {
      lineIndex: number;
      charIndex: number;
    };
    init?: MouseEventInit;
  }[];
  expectedText: string;
  expectedSelection: {
    top: boolean;
    center: boolean;
    bottom: boolean;
  };
}

interface Common {
  textLines: string[];
}

const MockEditor: React.FC<Omit<EditorProps, 'onChangeText'>> = (props) => {
  const [, setDummyText] = React.useState('');
  return <Editor onChangeText={setDummyText} {...props} />;
};

fixtureTest<TestCase, Common>('mouseEvents', 'Editor', 'mouse', (testCase, common) => {
  const text = common.textLines.join('\n');

  const SpiedTextLines = jest.spyOn(SelectionModule, 'Selection');
  const spiedPositionToCursorCoordinate = jest.spyOn(editorUtilsModule, 'positionToCursorCoordinate');

  spiedPositionToCursorCoordinate.mockImplementation((p, s, pos) => ({ lineIndex: pos[1], charIndex: pos[0] }));

  const { rerender } = render(<MockEditor text={text} />);

  const body = screen.getByTestId('editor-body');
  for (const event of testCase.inputEvents) {
    fireEvent[event.type](body, {
      clientX: event.coordinate.charIndex,
      clientY: event.coordinate.lineIndex,
      ...event.init,
    });
  }

  for (const position of ['top', 'center', 'bottom'] as const) {
    const selectionExpect = expect(screen.queryByTestId(`selection-${position}`));
    if (testCase.expectedSelection[position]) {
      selectionExpect.toBeInTheDocument();
    } else {
      selectionExpect.not.toBeInTheDocument();
    }
  }

  const MockSelection: React.FC<{ textSelection: TextSelection | undefined }> = ({ textSelection }) => (
    <div data-testid="mock-selected-text">{getSelectedText(text, textSelection)}</div>
  );

  SpiedTextLines.mockImplementation(MockSelection);
  rerender(<MockEditor text={text} />);
  expect(screen.getByTestId('mock-selected-text').textContent).toBe(testCase.expectedText);

  SpiedTextLines.mockRestore();
  spiedPositionToCursorCoordinate.mockRestore();
});
