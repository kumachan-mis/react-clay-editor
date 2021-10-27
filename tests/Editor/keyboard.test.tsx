import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { EditorProps } from '../../src';
import * as editorUtilsModule from '../../src/Editor/callbacks/utils';
import * as textLinesModule from '../../src/TextLines';
import { osUserAgents } from '../constants';
import { runFixtureTests, BaseTestCase } from '../fixture';
import { MockEditor, MockTextLines } from '../mocks';

interface TestCase extends BaseTestCase {
  name: string;
  inputTyping: string[];
  expectedLines: string[];
}

interface Common {
  options?: Omit<EditorProps, 'text' | 'onChangeText' | 'syntax'>;
  typingAlias?: Record<string, string[] | undefined>;
}

function createTest(syntax: 'bracket' | 'markdown'): (testCase: TestCase, common: Common | undefined) => void {
  return (testCase, common) => {
    render(<MockEditor syntax={syntax} {...common?.options} />);
    userEvent.click(screen.getByTestId('editor-body'));
    userEvent.keyboard(resolveTypingAlias(testCase.inputTyping, common?.typingAlias).join(''));

    for (let i = 0; i < testCase.expectedLines.length; i++) {
      const line = testCase.expectedLines[i];
      expect(screen.getByTestId(`mock-line-${i}`).textContent).toBe(line);
    }
    expect(screen.queryByTestId(`mock-line-${testCase.expectedLines.length}`)).not.toBeInTheDocument();
  };
}

function resolveTypingAlias(inputTyping: string[], typingAlias?: Record<string, string[] | undefined>): string[] {
  if (!typingAlias) return inputTyping;

  const resolvedTyping: string[] = [];
  for (const typingLine of inputTyping) {
    const resolvedTypingLines = typingAlias[typingLine];
    if (!resolvedTypingLines) resolvedTyping.push(typingLine);
    else resolvedTyping.push(...resolvedTypingLines);
  }

  return resolvedTyping;
}

const SpiedTextLines = jest.spyOn(textLinesModule, 'TextLines');
const spiedPositionToCursorCoordinate = jest.spyOn(editorUtilsModule, 'positionToCursorCoordinate');

beforeAll(() => {
  SpiedTextLines.mockImplementation(MockTextLines);
  spiedPositionToCursorCoordinate.mockImplementation(() => ({ lineIndex: 0, charIndex: 0 }));
});

afterAll(() => {
  SpiedTextLines.mockRestore();
  spiedPositionToCursorCoordinate.mockRestore();
});

describe('keyboardEvents (bracket) in Editor', () => {
  afterEach(() => {
    SpiedTextLines.mockClear();
    spiedPositionToCursorCoordinate.mockClear();
  });

  const testfun = createTest('bracket');
  for (const fixtureName of ['keyboardCommon', 'keyboardBracket', 'suggestionCommon', 'suggestionBracket']) {
    runFixtureTests<TestCase, Common | undefined>('Editor', fixtureName, testfun);
  }
});

describe('keyboardEvents (markdown) in Editor', () => {
  afterEach(() => {
    SpiedTextLines.mockClear();
    spiedPositionToCursorCoordinate.mockClear();
  });

  const testfun = createTest('markdown');
  for (const fixtureName of ['keyboardCommon', 'keyboardMarkdown', 'suggestionCommon', 'suggestionMarkdown']) {
    runFixtureTests<TestCase, Common | undefined>('Editor', fixtureName, testfun);
  }
});

describe('keyboardShortcuts (windows) in Editor', () => {
  const originalUserAgent = window.navigator.userAgent;

  beforeAll(() => {
    Object.defineProperty(window.navigator, 'userAgent', { value: osUserAgents.windows, configurable: true });
  });

  afterAll(() => {
    Object.defineProperty(window.navigator, 'userAgent', { value: originalUserAgent, configurable: true });
  });

  afterEach(() => {
    SpiedTextLines.mockClear();
    spiedPositionToCursorCoordinate.mockClear();
  });

  const testfn = createTest('bracket');
  for (const fixtureName of ['shortcutCommon', 'shortcutWindows']) {
    runFixtureTests<TestCase, Common | undefined>('Editor', fixtureName, testfn);
  }
});

describe('keyboardShortcuts (macos) in Editor', () => {
  const originalUserAgent = window.navigator.userAgent;

  beforeAll(() => {
    Object.defineProperty(window.navigator, 'userAgent', { value: osUserAgents.macos, configurable: true });
  });

  afterAll(() => {
    Object.defineProperty(window.navigator, 'userAgent', { value: originalUserAgent, configurable: true });
  });

  afterEach(() => {
    SpiedTextLines.mockClear();
    spiedPositionToCursorCoordinate.mockClear();
  });

  const testfn = createTest('bracket');
  for (const fixtureName of ['shortcutCommon', 'shortcutMacOS']) {
    runFixtureTests<TestCase, Common | undefined>('Editor', fixtureName, testfn);
  }
});
