import { CursorCoordinate } from '../../../../types/cursor/cursorCoordinate';
import { HeaderConstants } from '../../../atoms/root/Header';
import { TextFieldConstants } from '../../../atoms/root/TextField';
import { CharConstants } from '../../../atoms/text/Char';
import { CharGroupConstants } from '../../../atoms/text/CharGroup';
import { LineConstants } from '../../../atoms/text/Line';
import { LineGroupConstants } from '../../../atoms/text/LineGroup';

export function positionToCursorCoordinate(
  text: string,
  position: [number, number],
  element: HTMLElement
): CursorCoordinate | undefined {
  const lines = text.split('\n');
  const elements = document.elementsFromPoint(...position) as HTMLElement[];

  let cursorCoordinate: CursorCoordinate | undefined = undefined;

  const headerElement = findElement(elements, HeaderConstants.selectIdRegex, element);
  if (headerElement) return undefined;

  cursorCoordinate = cursorCoordinateChar(lines, position, elements, element);
  if (cursorCoordinate) return cursorCoordinate;

  cursorCoordinate = cursorCoordinateCharGroup(lines, position, elements, element);
  if (cursorCoordinate) return cursorCoordinate;

  cursorCoordinate = cursorCoordinateLine(lines, position, elements, element);
  if (cursorCoordinate) return cursorCoordinate;

  cursorCoordinate = cursorCoordinateLineGroup(lines, position, elements, element);
  if (cursorCoordinate) return cursorCoordinate;

  const marginBottomElement = findElement(elements, TextFieldConstants.selectIdRegex, element);
  if (!marginBottomElement) return undefined;
  return { lineIndex: lines.length - 1, charIndex: lines[lines.length - 1].length };
}

function cursorCoordinateChar(
  lines: string[],
  position: [number, number],
  elements: HTMLElement[],
  element: HTMLElement
): CursorCoordinate | undefined {
  const charElement = findElement(elements, CharConstants.selectIdRegex, element);
  const selectId = charElement?.getAttribute('data-selectid');
  if (!charElement || !selectId) return undefined;

  const groups = selectId.match(CharConstants.selectIdRegex)?.groups as Record<string, string>;
  const lineIndex = Number.parseInt(groups.lineIndex, 10);
  const charIndex = Number.parseInt(groups.charIndex, 10);
  const [x] = position;

  if (charIndex === lines[lineIndex].length) return { lineIndex, charIndex };

  const charRect = charElement.getBoundingClientRect();
  if (x <= charRect.left + charRect.width / 2) return { lineIndex, charIndex };

  return { lineIndex, charIndex: charIndex + 1 };
}

function cursorCoordinateCharGroup(
  lines: string[],
  position: [number, number],
  elements: HTMLElement[],
  element: HTMLElement
): CursorCoordinate | undefined {
  const charGroupElement = findElement(elements, CharGroupConstants.selectIdRegex, element);
  const selectId = charGroupElement?.getAttribute('data-selectid');
  if (!charGroupElement || !selectId) return undefined;

  const groups = selectId.match(CharGroupConstants.selectIdRegex)?.groups as Record<string, string>;
  const lineIndex = Number.parseInt(groups.lineIndex, 10);
  const firstCharIndex = Number.parseInt(groups.first, 10);
  const lastCharIndex = Number.parseInt(groups.last, 10);
  const [x] = position;

  const charGroupRect = charGroupElement.getBoundingClientRect();

  if (x <= charGroupRect.left + charGroupRect.width / 2) {
    return { lineIndex, charIndex: firstCharIndex };
  } else {
    return { lineIndex, charIndex: lastCharIndex + 1 };
  }
}

function cursorCoordinateLine(
  lines: string[],
  position: [number, number],
  elements: HTMLElement[],
  element: HTMLElement
): CursorCoordinate | undefined {
  const lineElement = findElement(elements, LineConstants.selectIdRegex, element);
  const selectId = lineElement?.getAttribute('data-selectid');
  if (!lineElement || !selectId) return undefined;

  const groups = selectId.match(LineConstants.selectIdRegex)?.groups as Record<string, string>;
  const lineIndex = Number.parseInt(groups.lineIndex, 10);
  const [x, y] = position;

  const currentLine = lines[lineIndex];
  let [charIndex, minDistance] = [lines[lineIndex].length, Number.MAX_VALUE];

  for (let index = 0; index <= currentLine.length; index++) {
    const charElement = lineElement.querySelector(`span[data-selectid="${CharConstants.selectId(lineIndex, index)}"]`);
    const charRect = charElement?.getBoundingClientRect();
    if (!charRect) continue;

    const [ldx, ldy] = [charRect.left - x, (charRect.top + charRect.bottom) / 2 - y];
    const leftDistance = ldx * ldx + lineElement.clientWidth * ldy * ldy;
    if (leftDistance <= minDistance) {
      minDistance = leftDistance;
      charIndex = index;
    }

    if (index === currentLine.length) break;

    const [rdx, rdy] = [charRect.right - x, (charRect.top + charRect.bottom) / 2 - y];
    const rightDistance = rdx * rdx + lineElement.clientWidth * rdy * rdy;
    if (rightDistance <= minDistance) {
      minDistance = rightDistance;
      charIndex = index + 1;
    }
  }

  return { lineIndex, charIndex };
}

function cursorCoordinateLineGroup(
  lines: string[],
  position: [number, number],
  elements: HTMLElement[],
  element: HTMLElement
): CursorCoordinate | undefined {
  const lineGroupElement = findElement(elements, LineGroupConstants.selectIdRegex, element);
  const selectId = lineGroupElement?.getAttribute('data-selectid');
  if (!lineGroupElement || !selectId) return undefined;

  const groups = selectId.match(LineGroupConstants.selectIdRegex)?.groups as Record<string, string>;
  const firstLineIndex = Number.parseInt(groups.first, 10);
  const lastLineIndex = Number.parseInt(groups.last, 10);
  const [, y] = position;

  const lineGroupRect = lineGroupElement.getBoundingClientRect();

  if (y <= lineGroupRect.top + lineGroupRect.height / 2) {
    return { lineIndex: firstLineIndex, charIndex: 0 };
  } else {
    return { lineIndex: lastLineIndex, charIndex: lines[lastLineIndex].length };
  }
}

function findElement(elements: HTMLElement[], selectIdRegex: RegExp, element: HTMLElement): HTMLElement | undefined {
  return elements.find((e) => selectIdRegex.test(e.getAttribute('data-selectid') ?? '') && element.contains(e));
}
