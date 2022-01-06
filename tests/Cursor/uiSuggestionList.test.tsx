import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { EditorProps } from '../../src';
import * as utils from '../../src/Editor/callbacks/utils';
import { runFixtureTests, BaseTestCase } from '../fixture';
import { MockEditor, expectTextLinesToBe } from '../mocks';

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

const spiedPositionToCursorCoordinate = jest.spyOn(utils, 'positionToCursorCoordinate');

beforeAll(() => {
  spiedPositionToCursorCoordinate.mockImplementation(() => ({ lineIndex: 0, charIndex: 0 }));
});

afterAll(() => {
  spiedPositionToCursorCoordinate.mockRestore();
});

describe('UI of Suggestion List', () => {
  afterEach(() => {
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
