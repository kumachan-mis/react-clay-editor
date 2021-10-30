import { render, screen } from '@testing-library/react';
import React from 'react';

import { Viewer, ViewerProps } from '../../src';
import { runFixtureTests, BaseTestCase } from '../fixture';

interface TestCase extends BaseTestCase {
  name: string;
  inputLines: string[];
  options?: Omit<ViewerProps, 'text' | 'syntax' | 'cursorCoordinate'>;
  expectedTestIdCounts?: {
    [testId: string]: number | undefined;
  };
  expectedViewLines?: string[];
  expectedEditLines?: string[];
}

describe('UI of Viwer (bracket syntax)', () => {
  const testfun = createTest('bracket');
  for (const fixtureName of ['uiTextLinesCommon', 'uiTextLinesBracket']) {
    runFixtureTests<TestCase>('TextLines', fixtureName, testfun);
  }
});

describe('UI of Viwer (markdown syntax)', () => {
  const testfun = createTest('markdown');
  for (const fixtureName of ['uiTextLinesCommon', 'uiTextLinesMarkdown']) {
    runFixtureTests<TestCase>('TextLines', fixtureName, testfun);
  }
});

function createTest(syntax: 'bracket' | 'markdown'): (testCase: TestCase) => void {
  return (testCase) => {
    const text = testCase.inputLines.join('\n');
    const { rerender } = render(<Viewer text={text} syntax={syntax} {...testCase?.options} />);

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
          expect(screen.getByTestId(`char-L${lineIndex}C${charIndex}`).textContent).toBe(char !== '.' ? char : '');
          charIndex++;
        }

        expect(screen.getByTestId(`char-L${lineIndex}C${charIndex}`)).toBeInTheDocument();
        expect(screen.queryByTestId(`char-L${lineIndex}C${charIndex + 1}`)).not.toBeInTheDocument();
        lineIndex++;
      }
      expect(screen.queryByTestId(`line-L${lineIndex}`)).not.toBeInTheDocument();
    }

    const expectedEditLines = testCase.expectedEditLines || testCase.inputLines;

    let lineIndex = 0;
    for (const editLine of expectedEditLines) {
      const cursorCoordinate = { lineIndex, charIndex: 0 };
      rerender(<Viewer text={text} syntax={syntax} cursorCoordinate={cursorCoordinate} {...testCase?.options} />);

      expect(screen.getByTestId(`line-L${lineIndex}`)).toBeInTheDocument();

      let charIndex = 0;
      for (const char of [...editLine]) {
        expect(screen.getByTestId(`char-L${lineIndex}C${charIndex}`).textContent).toBe(char !== '.' ? char : '');
        charIndex++;
      }

      expect(screen.getByTestId(`char-L${lineIndex}C${charIndex}`)).toBeInTheDocument();
      expect(screen.queryByTestId(`char-L${lineIndex}C${charIndex + 1}`)).not.toBeInTheDocument();
      lineIndex++;
    }
    expect(screen.queryByTestId(`line-L${lineIndex}`)).not.toBeInTheDocument();
  };
}
