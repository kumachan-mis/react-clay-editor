import { CursorCoordinate } from '../src/types/cursor/cursorCoordinate';

export interface TestCase {
  name: string;
  text: string;
  cursorCoordinate: CursorCoordinate;
  amount: number;
  expected: CursorCoordinate;
}

export const testCases: TestCase[] = [
  {
    name: 'zero amount',
    text: ['123456789/123456789', '123456789', '123456789/123456789'].join('\n'),
    cursorCoordinate: {
      lineIndex: 1,
      charIndex: 7,
    },
    amount: 0,
    expected: {
      lineIndex: 1,
      charIndex: 7,
    },
  },
  {
    name: 'positive amount (current line)',
    text: ['123456789/123456789', '123456789', '123456789/123456789'].join('\n'),
    cursorCoordinate: {
      lineIndex: 1,
      charIndex: 5,
    },
    amount: 3,
    expected: {
      lineIndex: 1,
      charIndex: 8,
    },
  },
  {
    name: 'positive amount (next line)',
    text: ['123456789/123456789', '123456789', '123456789/123456789'].join('\n'),
    cursorCoordinate: {
      lineIndex: 1,
      charIndex: 2,
    },
    amount: 11,
    expected: {
      lineIndex: 2,
      charIndex: 3,
    },
  },
  {
    name: 'positive amount (too much)',
    text: ['123456789/123456789', '123456789', '123456789/123456789'].join('\n'),
    cursorCoordinate: {
      lineIndex: 1,
      charIndex: 1,
    },
    amount: 30,
    expected: {
      lineIndex: 2,
      charIndex: 19,
    },
  },
  {
    name: 'negative amount (current line)',
    text: ['123456789/123456789', '123456789', '123456789/123456789'].join('\n'),
    cursorCoordinate: {
      lineIndex: 1,
      charIndex: 7,
    },
    amount: -7,
    expected: {
      lineIndex: 1,
      charIndex: 0,
    },
  },
  {
    name: 'negative amount (previous line)',
    text: ['123456789/123456789', '123456789', '123456789/123456789'].join('\n'),
    cursorCoordinate: {
      lineIndex: 1,
      charIndex: 2,
    },
    amount: -11,
    expected: {
      lineIndex: 0,
      charIndex: 11,
    },
  },
  {
    name: 'negative amount (too much)',
    text: ['123456789/123456789', '123456789', '123456789/123456789'].join('\n'),
    cursorCoordinate: {
      lineIndex: 1,
      charIndex: 2,
    },
    amount: -25,
    expected: {
      lineIndex: 0,
      charIndex: 0,
    },
  },
];
