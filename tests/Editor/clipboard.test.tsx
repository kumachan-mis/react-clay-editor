import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { EventType } from '@testing-library/dom';

import { runFixtureTests, BaseTestCase } from '../fixture';
import { Editor, EditorProps } from '../../src';
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

const MockEditor: React.FC<Omit<EditorProps, 'onChangeText'>> = ({ text: initText, ...props }) => {
  const [text, setText] = React.useState(initText);
  return <Editor text={text} onChangeText={setText} {...props} />;
};

const MockTextLines: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div>
      {text.split('\n').map((line, i) => (
        <div key={i} data-testid={`mock-line-${i}`}>
          {line}
        </div>
      ))}
    </div>
  );
};

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
    render(<MockEditor text={text} />);

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
    render(<MockEditor text={text} />);

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
