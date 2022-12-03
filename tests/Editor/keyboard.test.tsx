import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import * as cursor from '../../src/components/organisms/EditorTextFieldBody/common/cursor';
import { EditorProps } from '../../src/contexts/EditorPropsContext';
import { osUserAgents } from '../constants';
import { runFixtureTests, BaseTestCase } from '../fixture';
import { MockEditor, expectTextLinesToBe } from '../mocks';

interface TestCase extends BaseTestCase {
  name: string;
  inputTyping: string[];
  expectedLines: string[];
}

interface Common {
  options?: Omit<EditorProps, 'text' | 'setText' | 'syntax'>;
  typingAlias?: Record<string, string[] | undefined>;
}

const spiedPositionToCursorCoordinate = jest.spyOn(cursor, 'positionToCursorCoordinate');

beforeAll(() => {
  spiedPositionToCursorCoordinate.mockImplementation(() => ({ lineIndex: 0, charIndex: 0 }));
});

afterAll(() => {
  spiedPositionToCursorCoordinate.mockRestore();
});

describe('keyboardEvents (bracket) in Editor', () => {
  afterEach(() => {
    spiedPositionToCursorCoordinate.mockClear();
  });

  const testfun = createTest('bracket');
  for (const fixtureName of ['keyboardCommon', 'keyboardBracket', 'suggestionCommon', 'suggestionBracket']) {
    runFixtureTests<TestCase, Common | undefined>('Editor', fixtureName, testfun);
  }
});

describe('keyboardEvents (markdown) in Editor', () => {
  afterEach(() => {
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
    spiedPositionToCursorCoordinate.mockClear();
  });

  const testfn = createTest('bracket');
  for (const fixtureName of ['shortcutCommon', 'shortcutMacOS']) {
    runFixtureTests<TestCase, Common | undefined>('Editor', fixtureName, testfn);
  }
});

function createTest(syntax: 'bracket' | 'markdown'): (testCase: TestCase, common: Common | undefined) => void {
  return (testCase, common) => {
    render(<MockEditor syntax={syntax} {...common?.options} />);
    userEvent.click(screen.getByTestId('text-field'));
    userEvent.keyboard(resolveTypingAlias(testCase.inputTyping, common?.typingAlias).join(''));
    expectTextLinesToBe(screen, testCase.expectedLines);
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
