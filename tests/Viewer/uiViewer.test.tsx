import { render, screen, Screen } from '@testing-library/react';
import React from 'react';

import { useEmbededLinkForceClickable } from '../../src/components/atoms/text/EmbededLink/hooks';
import * as hooks from '../../src/components/molecules/text/Text/TextNodeComponent.hooks';
import { ViewerRoot, ViewerRootProps } from '../../src/components/organisms/ViewerRoot';
import { ViewerTextFieldBody } from '../../src/components/organisms/ViewerTextFieldBody';
import { ViewerTextFieldRoot } from '../../src/components/organisms/ViewerTextFieldRoot';
import { runFixtureTests, BaseTestCase } from '../fixture';

interface TestCase extends BaseTestCase {
  name: string;
  inputLines: string[];
  options?: Omit<ViewerRootProps, 'text' | 'syntax'>;
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
    const spiedUseTextNodeComponent = jest.spyOn(hooks, 'useTextNodeComponent');
    const text = testCase.inputLines.join('\n');

    const { unmount } = render(
      <ViewerRoot text={text} syntax={syntax} {...testCase?.options}>
        <ViewerTextFieldRoot>
          <ViewerTextFieldBody />
        </ViewerTextFieldRoot>
      </ViewerRoot>
    );
    expectTestIdCountsToBe(screen, testCase.expectedTestIdCounts);
    expectTextLinesToBe(screen, testCase.expectedViewLines);

    unmount();

    spiedUseTextNodeComponent.mockImplementation(() => {
      const linkForceClickable = useEmbededLinkForceClickable();
      return { editMode: () => true, linkForceClickable };
    });
    render(
      <ViewerRoot text={text} syntax={syntax} {...testCase?.options}>
        <ViewerTextFieldRoot>
          <ViewerTextFieldBody />
        </ViewerTextFieldRoot>
      </ViewerRoot>
    );
    expectTextLinesToBe(screen, testCase.expectedEditLines || testCase.inputLines);
    spiedUseTextNodeComponent.mockRestore();
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
