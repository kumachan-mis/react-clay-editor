import { EventType } from '@testing-library/dom';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import * as utils from '../../src/Editor/callbacks/utils';
import * as selection from '../../src/components/molecules/selection/Selection';
import { TextSelection } from '../../src/components/molecules/selection/Selection/types';
import { getSelectionText } from '../../src/components/molecules/selection/Selection/utils';
import { runFixtureTests, BaseTestCase } from '../fixture';
import { MockEditor, SpyOnGetBoundingClientRect } from '../mocks';

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

const spiedPositionToCursorCoordinate = jest.spyOn(utils, 'positionToCursorCoordinate');

beforeAll(() => {
  spiedPositionToCursorCoordinate.mockImplementation((text, pos) => ({ lineIndex: pos[1], charIndex: pos[0] }));
});

afterAll(() => {
  spiedPositionToCursorCoordinate.mockRestore();
});

describe('mouseSelection in Editor', () => {
  afterEach(() => {
    spiedPositionToCursorCoordinate.mockClear();
  });

  runFixtureTests<TestCase, Common>('Editor', 'mouseSelection', (testCase, common) => {
    const SpiedSelection = jest.spyOn(selection, 'Selection');

    const text = common.textLines.join('\n');
    const { rerender } = render(<MockEditor initText={text} />);

    const spyOnGetBoundingClientRect = new SpyOnGetBoundingClientRect(screen);
    const spiedGetBoundingClientRects = testCase.inputEvents.map((event) =>
      spyOnGetBoundingClientRect.char(event.coordinate.lineIndex, event.coordinate.charIndex)
    );

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

    SpiedSelection.mockImplementation(MockSelection);
    rerender(<MockEditor initText={text} />);
    expect(screen.getByTestId('mock-selected-text').textContent).toBe(expectedSelectionText);
    SpiedSelection.mockRestore();
    for (const spiedGetBoundingClientRect of spiedGetBoundingClientRects) {
      spiedGetBoundingClientRect.mockRestore();
    }
  });
});
