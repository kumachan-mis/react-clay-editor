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

const MockEditor: React.FC<Omit<EditorProps, 'onChangeText'>> = ({ text: initText, ...props }) => {
  const [text, setText] = React.useState(initText);
  return <Editor text={text} onChangeText={setText} {...props} />;
};

const spiedPositionToCursorCoordinate = jest.spyOn(editorUtilsModule, 'positionToCursorCoordinate');

beforeAll(() => {
  spiedPositionToCursorCoordinate.mockImplementation((p, s, pos) => ({ lineIndex: pos[1], charIndex: pos[0] }));
});

afterAll(() => {
  spiedPositionToCursorCoordinate.mockRestore();
});

describe('mouseEvents in Editor', () => {
  afterEach(() => {
    spiedPositionToCursorCoordinate.mockClear();
  });

  runFixtureTests<TestCase, Common>('Editor', 'mouse', (testCase, common) => {
    const SpiedTextLines = jest.spyOn(SelectionModule, 'Selection');
    const text = common.textLines.join('\n');

    const { rerender } = render(<MockEditor text={text} />);
    const spiedGetBoundingClientRects: jest.SpyInstance<DOMRect, []>[] = [];
    for (const event of testCase.inputEvents) {
      const charEl = screen.getByTestId(`char-L${event.coordinate.lineIndex}C${event.coordinate.charIndex}`);
      const spiedGetBoundingClientRect = jest.spyOn(charEl, 'getBoundingClientRect');
      spiedGetBoundingClientRect.mockImplementation(() => ({
        width: 10,
        height: 10,
        top: 15 * event.coordinate.lineIndex,
        left: 15 * event.coordinate.charIndex,
        bottom: 15 * event.coordinate.lineIndex + 10,
        right: 15 * event.coordinate.charIndex + 10,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }));
      spiedGetBoundingClientRects.push(spiedGetBoundingClientRect);
    }

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
    for (const spiedGetBoundingClientRect of spiedGetBoundingClientRects) {
      spiedGetBoundingClientRect.mockRestore();
    }
  });
});
