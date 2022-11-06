import { CursorCoordinate } from '../src/components/molecules/cursor/Cursor/types';

export interface TestCase {
  name: string;
  text: string;
  cursorCoordinate: CursorCoordinate;
  expected: number;
}

export const testCases: TestCase[] = [
  {
    name: 'line zero',
    text: ['123456789/123456789', '123456789', '123456789/123456789'].join('\n'),
    cursorCoordinate: {
      lineIndex: 0,
      charIndex: 7,
    },
    expected: 7,
  },
  {
    name: 'line non-zero',
    text: ['123456789/123456789', '123456789', '123456789/123456789'].join('\n'),
    cursorCoordinate: {
      lineIndex: 2,
      charIndex: 3,
    },
    expected: 33,
  },
  {
    name: 'empty text',
    text: '',
    cursorCoordinate: {
      lineIndex: 0,
      charIndex: 0,
    },
    expected: 0,
  },
];
