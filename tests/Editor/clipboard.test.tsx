import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { EventType } from '@testing-library/dom';

import { MockEditor, MockTextLines } from '../mocks';
import { runFixtureTests, BaseTestCase } from '../fixture';
import * as editorUtilsModule from '../../src/Editor/callbacks/utils';
import * as textLinesModule from '../../src/TextLines';

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

const SpiedTextLines = jest.spyOn(textLinesModule, 'TextLines');
const spiedPositionToCursorCoordinate = jest.spyOn(editorUtilsModule, 'positionToCursorCoordinate');

beforeAll(() => {
  SpiedTextLines.mockImplementation(MockTextLines);
  spiedPositionToCursorCoordinate.mockImplementation((p, s, pos) => ({ lineIndex: pos[1], charIndex: pos[0] }));
});

afterAll(() => {
  SpiedTextLines.mockRestore();
  spiedPositionToCursorCoordinate.mockRestore();
});

describe('clipboardEvents (read) in Editor', () => {
  afterEach(() => {
    SpiedTextLines.mockClear();
    spiedPositionToCursorCoordinate.mockClear();
  });

  runFixtureTests<ReadTestCase, Common>('Editor', 'clipboardRead', (testCase, common) => {
    const text = common.textLines.join('\n');
    render(<MockEditor initText={text} />);

    const body = screen.getByTestId('editor-body');
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

    for (let i = 0; i < testCase.expectedLines.length; i++) {
      const line = testCase.expectedLines[i];
      expect(screen.getByTestId(`mock-line-${i}`).textContent).toBe(line);
    }
    expect(screen.queryByTestId(`mock-line-${testCase.expectedLines.length}`)).not.toBeInTheDocument();
  });
});

describe('clipboardEvents (write) in Editor', () => {
  afterEach(() => {
    SpiedTextLines.mockClear();
    spiedPositionToCursorCoordinate.mockClear();
  });

  runFixtureTests<WriteTestCase, Common>('Editor', 'clipboardWrite', (testCase, common) => {
    const text = common.textLines.join('\n');
    render(<MockEditor initText={text} />);

    const body = screen.getByTestId('editor-body');
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

    for (let i = 0; i < testCase.expectedLines.length; i++) {
      const line = testCase.expectedLines[i];
      expect(screen.getByTestId(`mock-line-${i}`).textContent).toBe(line);
    }
    expect(screen.queryByTestId(`mock-line-${testCase.expectedLines.length}`)).not.toBeInTheDocument();
  });
});