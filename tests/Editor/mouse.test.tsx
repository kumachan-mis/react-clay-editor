import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { EventType } from '@testing-library/dom';

import { runFixtureTests, BaseTestCase } from '../fixture';
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
}

interface Common {
  textLines: string[];
}

const MockEditor: React.FC<Omit<EditorProps, 'onChangeText'>> = (props) => {
  const [, setDummyText] = React.useState('');
  return <Editor onChangeText={setDummyText} {...props} />;
};

describe('mouseEvents in Editor', () => {
  const spiedPositionToCursorCoordinate = jest.spyOn(editorUtilsModule, 'positionToCursorCoordinate');

  beforeAll(() => {
    spiedPositionToCursorCoordinate.mockImplementation((p, s, pos) => ({ lineIndex: pos[1], charIndex: pos[0] }));
  });

  afterEach(() => {
    spiedPositionToCursorCoordinate.mockClear();
  });

  afterAll(() => {
    spiedPositionToCursorCoordinate.mockRestore();
  });

  runFixtureTests<TestCase, Common>('Editor', 'mouse', (testCase, common) => {
    const SpiedTextLines = jest.spyOn(SelectionModule, 'Selection');
    const text = common.textLines.join('\n');

    const { rerender } = render(<MockEditor text={text} />);

    const body = screen.getByTestId('editor-body');
    for (const event of testCase.inputEvents) {
      fireEvent[event.type](body, {
        clientX: event.coordinate.charIndex,
        clientY: event.coordinate.lineIndex,
        ...event.init,
      });
    }

    if (testCase.expectedText) {
      expect(screen.queryAllByTestId('selection')).not.toEqual([]);
    } else {
      expect(screen.queryAllByTestId('selection')).toEqual([]);
    }

    const MockSelection: React.FC<{ textSelection: TextSelection | undefined }> = ({ textSelection }) => (
      <div data-testid="mock-selected-text">{getSelectedText(text, textSelection)}</div>
    );

    SpiedTextLines.mockImplementation(MockSelection);
    rerender(<MockEditor text={text} />);
    expect(screen.getByTestId('mock-selected-text').textContent).toBe(testCase.expectedText);
    SpiedTextLines.mockRestore();
  });
});
