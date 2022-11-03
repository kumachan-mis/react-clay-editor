import { EventType } from '@testing-library/dom';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { EditorProps } from '../../src';
import * as utils from '../../src/Editor/callbacks/utils';
import { runFixtureTests, BaseTestCase } from '../fixture';
import { MockEditor, expectTextLinesToBe } from '../mocks';

interface TestCase extends BaseTestCase {
  name: string;
  inputEvents: {
    type: EventType;
    init?: KeyboardEventInit;
  }[];
  options?: Omit<EditorProps, 'text' | 'onChangeText' | 'syntax'>;
  expectedLines: string[];
}

const spiedPositionToCursorCoordinate = jest.spyOn(utils, 'positionToCursorCoordinate');

beforeAll(() => {
  spiedPositionToCursorCoordinate.mockImplementation(() => ({ lineIndex: 0, charIndex: 0 }));
});

afterAll(() => {
  spiedPositionToCursorCoordinate.mockRestore();
});

describe('compositionEvents in Editor', () => {
  afterEach(() => {
    spiedPositionToCursorCoordinate.mockClear();
  });

  runFixtureTests<TestCase>('Editor', 'composition', (testCase) => {
    render(<MockEditor {...testCase?.options} />);

    userEvent.click(screen.getByTestId('editor-body'));

    const textarea = screen.getByRole('textbox');
    for (const event of testCase.inputEvents) {
      fireEvent[event.type](textarea, event.init);
    }

    expectTextLinesToBe(screen, testCase.expectedLines);
  });
});
