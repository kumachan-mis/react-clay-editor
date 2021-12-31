import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { EditorProps } from '../../src';
import * as utils from '../../src/Editor/callbacks/utils';
import * as textLines from '../../src/TextLines';
import { runFixtureTests, BaseTestCase } from '../fixture';
import { MockEditor, MockTextLines, expectTextLinesToBe } from '../mocks';

interface TestCase extends BaseTestCase {
  name: string;
  inputTypingBefore: string[];
  inputClickIndex: number;
  inputTypingAfter: string[];
  expectedHeader: string;
  expectedLines: string[];
}

interface Common {
  options?: Omit<EditorProps, 'text' | 'onChangeText' | 'syntax'>;
}

const SpiedTextLines = jest.spyOn(textLines, 'TextLines');
const spiedPositionToCursorCoordinate = jest.spyOn(utils, 'positionToCursorCoordinate');

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
    userEvent.keyboard(testCase.inputTypingBefore.join(''));

    expect(screen.getByTestId('suggestion-header').textContent).toBe(testCase.expectedHeader);

    userEvent.click(screen.getByTestId(`suggestion-item-${testCase.inputClickIndex}`));

    expect(screen.queryByTestId('suggestion-header')).not.toBeInTheDocument();
    expect(screen.queryByTestId('suggestion-item-0')).not.toBeInTheDocument();

    userEvent.keyboard(testCase.inputTypingAfter.join(''));

    expectTextLinesToBe(screen, testCase.expectedLines);
  });
});
