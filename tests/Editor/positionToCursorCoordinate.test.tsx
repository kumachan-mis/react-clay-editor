import * as React from 'react';
import { render, screen } from '@testing-library/react';

import {
  MockEditor,
  spyOnCharGetBoundingClientRect,
  spyOnCharGroupGetBoundingClientRect,
  spyOnLineGetBoundingClientRect,
  spyOnLineGroupGetBoundingClientRect,
  spyOnEditorBodyGetBoundingClientRect,
  mockElementsFromPoint,
} from '../mocks';
import { runFixtureTests, BaseTestCase } from '../fixture';
import { TextLinesConstants } from '../../src/TextLines/constants';
import { positionToCursorCoordinate } from '../../src/Editor/callbacks/utils';

interface TestCase extends BaseTestCase {
  name: string;
  inputPosition: [number, number];
  expectedCoordinate: {
    lineIndex: number;
    charIndex: number;
  };
}

interface Common {
  config: {
    size: number;
    chars: number;
    lines: number;
  };
  textLines: string[];
}

describe('function positionToCursorCoordinate in Editor', () => {
  runFixtureTests<TestCase, Common>('Editor', 'positionToCursorCoordinate', (testCase, common) => {
    const text = common.textLines.join('\n');
    render(<MockEditor initText={text} />);

    const charElements = screen.getAllByTestId(/^char-L\d+C\d+$/);
    const charGroupElements = screen.getAllByTestId(/^char-group-L\d+C\d+-\d+$/);
    const lineElements = screen.getAllByTestId(/^line-L\d+$/);
    const lineGroupElements = screen.getAllByTestId(/^line-group-L\d+-\d+$/);
    const body = screen.getByTestId('editor-body');

    const originalElementsFromPoint = document.elementFromPoint;

    const elements = [...charElements, ...charGroupElements, ...lineElements, ...lineGroupElements, body];
    Object.defineProperty(document, 'elementsFromPoint', {
      value: (x: number, y: number) => mockElementsFromPoint(x, y, elements),
      configurable: true,
    });

    const config = common.config;

    const spiedCharGetBoundingClientRects = charElements.map((element) => {
      const testId = element.getAttribute('data-testid') as string;
      const groups = testId.match(TextLinesConstants.char.selectIdRegex)?.groups as Record<string, string>;
      const lineIndex = Number.parseInt(groups['lineIndex'], 10);
      const charIndex = Number.parseInt(groups['charIndex'], 10);
      return spyOnCharGetBoundingClientRect(screen, lineIndex, charIndex, config.size);
    });
    const spiedCharGroupGetBoundingClientRects = charGroupElements.map((element) => {
      const testId = element.getAttribute('data-testid') as string;
      const groups = testId.match(TextLinesConstants.charGroup.selectIdRegex)?.groups as Record<string, string>;
      const lineIndex = Number.parseInt(groups['lineIndex'], 10);
      const firstCharIndex = Number.parseInt(groups['first'], 10);
      const lastCharIndex = Number.parseInt(groups['last'], 10);
      return spyOnCharGroupGetBoundingClientRect(screen, lineIndex, firstCharIndex, lastCharIndex, config.size);
    });
    const spiedLineGetBoundingClientRects = lineElements.map((element) => {
      const testId = element.getAttribute('data-testid') as string;
      const groups = testId.match(TextLinesConstants.line.selectIdRegex)?.groups as Record<string, string>;
      const lineIndex = Number.parseInt(groups['lineIndex'], 10);
      return spyOnLineGetBoundingClientRect(screen, lineIndex, config.chars, config.size);
    });
    const spiedLineGroupGetBoundingClientRects = lineGroupElements.map((element) => {
      const testId = element.getAttribute('data-testid') as string;
      const groups = testId.match(TextLinesConstants.lineGroup.selectIdRegex)?.groups as Record<string, string>;
      const firstLineIndex = Number.parseInt(groups['first'], 10);
      const lastLineIndex = Number.parseInt(groups['last'], 10);
      return spyOnLineGroupGetBoundingClientRect(screen, firstLineIndex, lastLineIndex, config.chars, config.size);
    });
    const spiedEditorBodyGetBoundingClientRect = spyOnEditorBodyGetBoundingClientRect(
      screen,
      config.chars,
      config.lines,
      config.size
    );

    const root = screen.getByTestId('editor-root');
    expect(positionToCursorCoordinate(text, testCase.inputPosition, root)).toEqual(testCase.expectedCoordinate);

    for (const spiedGetBoundingClientRects of [
      ...spiedCharGetBoundingClientRects,
      ...spiedCharGroupGetBoundingClientRects,
      ...spiedLineGetBoundingClientRects,
      ...spiedLineGroupGetBoundingClientRects,
      spiedEditorBodyGetBoundingClientRect,
    ]) {
      spiedGetBoundingClientRects.mockRestore();
    }

    Object.defineProperty(document, 'elementsFromPoint', { value: originalElementsFromPoint, configurable: true });
  });
});
