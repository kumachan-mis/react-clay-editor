import { EventType } from '@testing-library/dom';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import * as cursor from '../../src/components/organisms/TextFieldBody/common/cursor';
import { runFixtureTests, BaseTestCase } from '../fixture';
import { MockEditor, expectTextLinesToBe } from '../mocks';

interface ReadTestCase extends BaseTestCase {
  name: string;
  inputMouseEvents: {
    type: EventType;
    coordinate: {
      lineIndex: number;
      charIndex: number;
    };
  }[];
  inputClipboardEvent: {
    type: EventType;
    data: string;
  };
  expectedLines: string[];
}

interface WriteTestCase extends BaseTestCase {
  name: string;
  inputMouseEvents: {
    type: EventType;
    coordinate: {
      lineIndex: number;
      charIndex: number;
    };
  }[];
  inputClipboardEvent: {
    type: EventType;
    expectedData: string;
  };
  expectedLines: string[];
}

interface Common {
  textLines: string[];
}

const spiedPositionToCursorCoordinate = jest.spyOn(cursor, 'positionToCursorCoordinate');

beforeAll(() => {
  spiedPositionToCursorCoordinate.mockImplementation((text, pos) => ({ lineIndex: pos[1], charIndex: pos[0] }));
});

afterAll(() => {
  spiedPositionToCursorCoordinate.mockRestore();
});

describe('clipboardEvents (read) in Editor', () => {
  afterEach(() => {
    spiedPositionToCursorCoordinate.mockClear();
  });

  runFixtureTests<ReadTestCase, Common>('Editor', 'clipboardRead', (testCase, common) => {
    const text = common.textLines.join('\n');
    render(<MockEditor initText={text} />);

    const body = screen.getByTestId('text-field-body');
    for (const event of testCase.inputMouseEvents) {
      fireEvent[event.type](body, {
        clientX: event.coordinate.charIndex,
        clientY: event.coordinate.lineIndex,
      });
    }

    const textarea = screen.getByRole('textbox');
    fireEvent[testCase.inputClipboardEvent.type](textarea, {
      clipboardData: { getData: () => testCase.inputClipboardEvent.data },
    });

    expectTextLinesToBe(screen, testCase.expectedLines);
  });
});

describe('clipboardEvents (write) in Editor', () => {
  afterEach(() => {
    spiedPositionToCursorCoordinate.mockClear();
  });

  runFixtureTests<WriteTestCase, Common>('Editor', 'clipboardWrite', (testCase, common) => {
    const text = common.textLines.join('\n');
    render(<MockEditor initText={text} />);

    const body = screen.getByTestId('text-field-body');
    for (const event of testCase.inputMouseEvents) {
      fireEvent[event.type](body, {
        clientX: event.coordinate.charIndex,
        clientY: event.coordinate.lineIndex,
      });
    }

    const textarea = screen.getByRole('textbox');
    fireEvent[testCase.inputClipboardEvent.type](textarea, {
      clipboardData: {
        setData: (format: string, data: string) => {
          expect(data).toBe(testCase.inputClipboardEvent.expectedData);
        },
      },
    });

    expectTextLinesToBe(screen, testCase.expectedLines);
  });
});
