import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { MockEditor, MockTextLines } from '../mocks';
import { runFixtureTests, BaseTestCase } from '../fixture';
import { EditorProps } from '../../src';
import * as editorUtilsModule from '../../src/Editor/callbacks/utils';
import * as textLinesModule from '../../src/TextLines';

interface TestCase extends BaseTestCase {
  name: string;
  inputTyping: string[];
  inputClickIndex: number;
  expectedHeader: string;
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

describe('UI of Suggestion List', () => {
  afterEach(() => {
    SpiedTextLines.mockClear();
    spiedPositionToCursorCoordinate.mockClear();
  });

  runFixtureTests<TestCase, Common | undefined>('Cursor', 'uiSuggestionList', (testCase, common) => {
    render(<MockEditor {...common?.options} />);
    userEvent.click(screen.getByTestId('editor-body'));
    userEvent.type(screen.getByRole('textbox'), testCase.inputTyping.join(''));

    expect(screen.getByTestId('suggestion-header').textContent).toBe(testCase.expectedHeader);

    userEvent.click(screen.getByTestId(`suggestion-item-${testCase.inputClickIndex}`));

    expect(screen.queryByTestId('suggestion-header')).not.toBeInTheDocument();
    expect(screen.queryByTestId('suggestion-item-0')).not.toBeInTheDocument();

    for (let i = 0; i < testCase.expectedLines.length; i++) {
      const line = testCase.expectedLines[i];
      expect(screen.getByTestId(`mock-line-${i}`).textContent).toBe(line);
    }
    expect(screen.queryByTestId(`mock-line-${testCase.expectedLines.length}`)).not.toBeInTheDocument();
  });
});