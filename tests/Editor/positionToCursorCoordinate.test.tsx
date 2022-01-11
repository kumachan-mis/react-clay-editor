import { render, screen } from '@testing-library/react';
import React from 'react';

import { positionToCursorCoordinate } from '../../src/Editor/callbacks/utils';
import { ComponentConstants } from '../../src/TextLines/components/constants';
import { runFixtureTests, BaseTestCase } from '../fixture';
import {
  MockEditor,
  SpyOnGetBoundingClientRect,
  SpyOnGetBoundingClientRectConfig,
  mockElementsFromPoint,
} from '../mocks';

interface TestCase extends BaseTestCase {
  name: string;
  inputPosition: [number, number];
  expectedCoordinate: {
    lineIndex: number;
    charIndex: number;
  };
}

interface Common {
  config: SpyOnGetBoundingClientRectConfig;
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

    const spyOnGetBoundingClientRect = new SpyOnGetBoundingClientRect(screen, common.config);

    const spiedCharGetBoundingClientRects = charElements.map((element) => {
      const testId = element.getAttribute('data-testid') as string;
      const groups = testId.match(ComponentConstants.char.selectIdRegex)?.groups as Record<string, string>;
      const lineIndex = Number.parseInt(groups['lineIndex'], 10);
      const charIndex = Number.parseInt(groups['charIndex'], 10);
      return spyOnGetBoundingClientRect.char(lineIndex, charIndex);
    });
    const spiedCharGroupGetBoundingClientRects = charGroupElements.map((element) => {
      const testId = element.getAttribute('data-testid') as string;
      const groups = testId.match(ComponentConstants.charGroup.selectIdRegex)?.groups as Record<string, string>;
      const lineIndex = Number.parseInt(groups['lineIndex'], 10);
      const firstCharIndex = Number.parseInt(groups['first'], 10);
      const lastCharIndex = Number.parseInt(groups['last'], 10);
      return spyOnGetBoundingClientRect.charGroup(lineIndex, firstCharIndex, lastCharIndex);
    });
    const spiedLineGetBoundingClientRects = lineElements.map((element) => {
      const testId = element.getAttribute('data-testid') as string;
      const groups = testId.match(ComponentConstants.line.selectIdRegex)?.groups as Record<string, string>;
      const lineIndex = Number.parseInt(groups['lineIndex'], 10);
      return spyOnGetBoundingClientRect.line(lineIndex);
    });
    const spiedLineGroupGetBoundingClientRects = lineGroupElements.map((element) => {
      const testId = element.getAttribute('data-testid') as string;
      const groups = testId.match(ComponentConstants.lineGroup.selectIdRegex)?.groups as Record<string, string>;
      const firstLineIndex = Number.parseInt(groups['first'], 10);
      const lastLineIndex = Number.parseInt(groups['last'], 10);
      return spyOnGetBoundingClientRect.lineGroup(firstLineIndex, lastLineIndex);
    });
    const spiedEditorBodyGetBoundingClientRect = spyOnGetBoundingClientRect.editorBody();

    const editor = screen.getByTestId('editor');
    expect(positionToCursorCoordinate(text, testCase.inputPosition, editor)).toEqual(testCase.expectedCoordinate);

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
