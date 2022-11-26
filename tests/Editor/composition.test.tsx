import { EventType } from '@testing-library/dom';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { EditorProps } from '../../src';
import * as cursor from '../../src/components/organisms/TextFieldBody/common/cursor';
import { runFixtureTests, BaseTestCase } from '../fixture';
import { MockEditor, expectTextLinesToBe } from '../mocks';

interface TestCase extends BaseTestCase {
  name: string;
  inputEvents: {
    type: EventType;
    init?: KeyboardEventInit;
  }[];
  options?: Omit<EditorProps, 'text' | 'setText' | 'syntax'>;
  expectedLines: string[];
}

const spiedPositionToCursorCoordinate = jest.spyOn(cursor, 'positionToCursorCoordinate');

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

    userEvent.click(screen.getByTestId('text-field-body'));

    const textarea = screen.getByRole('textbox');
    for (const event of testCase.inputEvents) {
      fireEvent[event.type](textarea, event.init);
    }

    expectTextLinesToBe(screen, testCase.expectedLines);
  });
});
