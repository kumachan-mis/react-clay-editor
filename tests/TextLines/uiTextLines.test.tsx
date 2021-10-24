import * as React from 'react';
import { render, screen } from '@testing-library/react';

import { runFixtureTests, BaseTestCase } from '../fixture';
import { Viewer, ViewerProps } from '../../src';

interface TestCase extends BaseTestCase {
  name: string;
  inputLines: string[];
  expectedTestIdCounts?: {
    [testId: string]: number | undefined;
  };
  expectedViewLines?: string[];
  expectedEditLines?: string[];
}

interface Common {
  options?: Omit<ViewerProps, 'text' | 'syntax' | 'cursorCoordinate'>;
}

function createTest(syntax: 'bracket' | 'markdown'): (testCase: TestCase, common: Common | undefined) => void {
  return (testCase, common) => {
    const text = testCase.inputLines.join('\n');
    const { rerender } = render(<Viewer text={text} syntax={syntax} {...common?.options} />);

    if (testCase.expectedTestIdCounts) {
      for (const [testId, count] of Object.entries(testCase.expectedTestIdCounts)) {
        expect(screen.getAllByTestId(testId).length).toBe(count);
      }
    }

    if (testCase.expectedViewLines) {
      let lineIndex = 0;
      for (const viewLine of testCase.expectedViewLines) {
        expect(screen.getByTestId(`line-L${lineIndex}`)).toBeInTheDocument();

        let charIndex = 0;
        for (const char of [...viewLine]) {
          expect(screen.getByTestId(`char-L${lineIndex}C${charIndex}`).textContent).toBe(char != '.' ? char : '');
          charIndex++;
        }

        expect(screen.getByTestId(`char-L${lineIndex}C${charIndex}`)).toBeInTheDocument();
        expect(screen.getByTestId(`char-L${lineIndex}C${charIndex + 1}`)).not.toBeInTheDocument();
        lineIndex++;
      }
      expect(screen.getByTestId(`line-L${lineIndex}`)).not.toBeInTheDocument();
    }

    const expectedEditLines = testCase.expectedEditLines || testCase.inputLines;

    let lineIndex = 0;
    for (const editLine of expectedEditLines) {
      const cursorCoordinate = { lineIndex, charIndex: 0 };
      rerender(<Viewer text={text} syntax={syntax} cursorCoordinate={cursorCoordinate} {...common?.options} />);

      expect(screen.getByTestId(`line-L${lineIndex}`)).toBeInTheDocument();

      let charIndex = 0;
      for (const char of [...editLine]) {
        expect(screen.getByTestId(`char-L${lineIndex}C${charIndex}`).textContent).toBe(char != '.' ? char : '');
        charIndex++;
      }

      expect(screen.getByTestId(`char-L${lineIndex}C${charIndex}`)).toBeInTheDocument();
      expect(screen.getByTestId(`char-L${lineIndex}C${charIndex + 1}`)).not.toBeInTheDocument();
      lineIndex++;
    }
    expect(screen.getByTestId(`line-L${lineIndex}`)).not.toBeInTheDocument();
  };
}

describe('UI of Viwer (bracket syntax)', () => {
  const testfun = createTest('bracket');
  for (const fixtureName of ['uiTextLinesCommon', 'uiTextLinesBracket']) {
    runFixtureTests<TestCase, Common | undefined>('TextLines', fixtureName, testfun);
  }
});

describe('UI of Viwer (markdown syntax)', () => {
  const testfun = createTest('markdown');
  for (const fixtureName of ['uiTextLinesCommon', 'uiTextLinesMarkdown']) {
    runFixtureTests<TestCase, Common | undefined>('TextLines', fixtureName, testfun);
  }
});
