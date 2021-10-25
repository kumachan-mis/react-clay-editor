import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { EventType } from '@testing-library/dom';

import { MockEditor, spyOnCharGetBoundingClientRect } from '../mocks';
import { runFixtureTests, BaseTestCase } from '../fixture';
import * as editorUtilsModule from '../../src/Editor/callbacks/utils';
import { TextSelection } from '../../src/Selection/types';
import { getSelectionText } from '../../src/Selection/utils';
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
  expectedSelectionLines: string[];
}

interface Common {
  textLines: string[];
}

const spiedPositionToCursorCoordinate = jest.spyOn(editorUtilsModule, 'positionToCursorCoordinate');

beforeAll(() => {
  spiedPositionToCursorCoordinate.mockImplementation((p, s, pos) => ({ lineIndex: pos[1], charIndex: pos[0] }));
});

afterAll(() => {
  spiedPositionToCursorCoordinate.mockRestore();
});

describe('mouseSelection in Editor', () => {
  afterEach(() => {
    spiedPositionToCursorCoordinate.mockClear();
  });

  runFixtureTests<TestCase, Common>('Editor', 'mouseSelection', (testCase, common) => {
    const SpiedTextLines = jest.spyOn(SelectionModule, 'Selection');
    const text = common.textLines.join('\n');

    const { rerender } = render(<MockEditor initText={text} />);
    const spiedGetBoundingClientRects: jest.SpyInstance<DOMRect, []>[] = [];
    for (const event of testCase.inputEvents) {
      const { lineIndex, charIndex } = event.coordinate;
      spiedGetBoundingClientRects.push(spyOnCharGetBoundingClientRect(screen, lineIndex, charIndex));
    }

    const body = screen.getByTestId('editor-body');
    for (const event of testCase.inputEvents) {
      const { lineIndex, charIndex } = event.coordinate;
      fireEvent[event.type](body, { clientX: charIndex, clientY: lineIndex, ...event.init });
    }

    const expectedSelectionText = testCase.expectedSelectionLines.join('\n');
    if (expectedSelectionText) {
      expect(screen.queryAllByTestId('selection')).not.toEqual([]);
    } else {
      expect(screen.queryAllByTestId('selection')).toEqual([]);
    }

    const MockSelection: React.FC<{ textSelection: TextSelection | undefined }> = ({ textSelection }) => (
      <div data-testid="mock-selected-text">{getSelectionText(text, textSelection)}</div>
    );

    SpiedTextLines.mockImplementation(MockSelection);
    rerender(<MockEditor initText={text} />);
    expect(screen.getByTestId('mock-selected-text').textContent).toBe(expectedSelectionText);
    SpiedTextLines.mockRestore();
    for (const spiedGetBoundingClientRect of spiedGetBoundingClientRects) {
      spiedGetBoundingClientRect.mockRestore();
    }
  });
});
