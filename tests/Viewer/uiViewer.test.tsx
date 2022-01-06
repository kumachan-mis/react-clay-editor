import { render, screen, Screen } from '@testing-library/react';
import React from 'react';

import { Viewer, ViewerProps } from '../../src';
import * as utils from '../../src/TextLines/utils';
import { runFixtureTests, BaseTestCase } from '../fixture';

interface TestCase extends BaseTestCase {
  name: string;
  inputLines: string[];
  options?: Omit<ViewerProps, 'text' | 'syntax' | 'cursorCoordinate'>;
  expectedTestIdCounts?: { [testId: string]: number | undefined };
  expectedViewLines?: string[];
  expectedEditLines?: string[];
}

describe('UI of Viewer (bracket syntax)', () => {
  const testfun = createTest('bracket');
  for (const fixtureName of ['uiViewerCommon', 'uiViewerBracket']) {
    runFixtureTests<TestCase>('Viewer', fixtureName, testfun);
  }
});

describe('UI of Viewer (markdown syntax)', () => {
  const testfun = createTest('markdown');
  for (const fixtureName of ['uiViewerCommon', 'uiViewerMarkdown']) {
    runFixtureTests<TestCase>('Viewer', fixtureName, testfun);
  }
});

function createTest(syntax: 'bracket' | 'markdown'): (testCase: TestCase) => void {
  return (testCase) => {
    const spiedCursorOnNode = jest.spyOn(utils, 'cursorOnNode');
    const text = testCase.inputLines.join('\n');
    const { rerender } = render(<Viewer text={text} syntax={syntax} {...testCase?.options} />);

    expectTestIdCountsToBe(screen, testCase.expectedTestIdCounts);
    expectTextLinesToBe(screen, testCase.expectedViewLines);

    spiedCursorOnNode.mockImplementation(() => true);
    rerender(<Viewer text={text} syntax={syntax} {...testCase?.options} />);
    expectTextLinesToBe(screen, testCase.expectedEditLines || testCase.inputLines);
    spiedCursorOnNode.mockRestore();
  };
}

function expectTestIdCountsToBe(screen: Screen, expectedTestIdCounts?: { [testId: string]: number | undefined }): void {
  if (!expectedTestIdCounts) return;

  for (const [testId, count] of Object.entries(expectedTestIdCounts)) {
    expect(screen.getAllByTestId(testId).length).toBe(count);
  }
}

function expectTextLinesToBe(screen: Screen, expectedLines?: string[]): void {
  if (!expectedLines) return;

  let lineIndex = 0;
  for (const editLine of expectedLines) {
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
}
