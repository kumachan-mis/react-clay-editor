import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { EventType } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import { MockEditor, MockTextLines } from './mockComponents';
import { runFixtureTests, BaseTestCase } from '../fixture';
import { EditorProps } from '../../src';
import * as editorUtilsModule from '../../src/Editor/callbacks/utils';
import * as textLinesModule from '../../src/TextLines';

interface TestCase extends BaseTestCase {
  name: string;
  inputEvents: {
    type: EventType;
    init?: KeyboardEventInit;
  }[];
  expectedLines: string[];
}

interface Common {
  options?: Omit<EditorProps, 'text' | 'onChangeText' | 'syntax'>;
}

const SpiedTextLines = jest.spyOn(textLinesModule, 'TextLines');
const spiedPositionToCursorCoordinate = jest.spyOn(editorUtilsModule, 'positionToCursorCoordinate');

beforeAll(() => {
  SpiedTextLines.mockImplementation(MockTextLines);
  spiedPositionToCursorCoordinate.mockImplementation(() => ({ lineIndex: 0, charIndex: 0 }));
});

afterAll(() => {
  SpiedTextLines.mockRestore();
  spiedPositionToCursorCoordinate.mockRestore();
});

describe('compositionEvents in Editor', () => {
  afterEach(() => {
    SpiedTextLines.mockClear();
    spiedPositionToCursorCoordinate.mockClear();
  });

  for (const fixtureName of [
    'compositionWithoutSuggestion',
    'compositionWithSuggestion',
    'compositionWithSuggestionIndex',
  ]) {
    runFixtureTests<TestCase, Common | undefined>('Editor', fixtureName, (testCase, common) => {
      render(<MockEditor {...common?.options} />);

      userEvent.click(screen.getByTestId('editor-body'));

      const textarea = screen.getByRole('textbox');
      for (const event of testCase.inputEvents) {
        fireEvent[event.type](textarea, event.init);
      }

      for (let i = 0; i < testCase.expectedLines.length; i++) {
        const line = testCase.expectedLines[i];
        expect(screen.getByTestId(`mock-line-${i}`).textContent).toBe(line);
      }
      expect(screen.queryByTestId(`mock-line-${testCase.expectedLines.length}`)).not.toBeInTheDocument();
    });
  }
});
