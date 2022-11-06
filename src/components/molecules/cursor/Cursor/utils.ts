import { CursorCoordinate } from './types';

export function moveCursor(text: string, coordinate: CursorCoordinate, amount: number): CursorCoordinate {
  if (amount === 0) return coordinate;

  const lines = text.split('\n');
  let { lineIndex, charIndex } = { ...coordinate };
  if (amount > 0) {
    while (amount > 0) {
      if (lineIndex === lines.length - 1) {
        charIndex += Math.min(amount, lines[lineIndex].length - charIndex);
        break;
      }
      if (charIndex + amount <= lines[lineIndex].length) {
        charIndex += amount;
        amount = 0;
      } else {
        amount -= lines[lineIndex].length - charIndex + 1;
        lineIndex++;
        charIndex = 0;
      }
    }
  } else {
    amount = -amount;
    while (amount > 0) {
      if (lineIndex === 0) {
        charIndex -= Math.min(amount, charIndex);
        break;
      }
      if (charIndex - amount >= 0) {
        charIndex -= amount;
        amount = 0;
      } else {
        amount -= charIndex + 1;
        lineIndex--;
        charIndex = lines[lineIndex].length;
      }
    }
  }
  return { lineIndex, charIndex };
}

export function cursorCoordinateToTextIndex(text: string, coordinate: CursorCoordinate): number {
  const lines = text.split('\n');
  let textIndex = 0;
  for (let lineIndex = 0; lineIndex < coordinate.lineIndex; lineIndex++) {
    textIndex += lines[lineIndex].length + 1;
  }
  textIndex += coordinate.charIndex;
  return textIndex;
}

export function copyCoordinate(coordinate: CursorCoordinate | undefined): CursorCoordinate | undefined {
  if (!coordinate) return undefined;
  return { ...coordinate };
}

export function coordinatesAreEqual(a: CursorCoordinate, b: CursorCoordinate): boolean {
  return a.lineIndex === b.lineIndex && a.charIndex === b.charIndex;
}
