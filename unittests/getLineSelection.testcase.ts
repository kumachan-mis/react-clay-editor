import { CursorCoordinate } from 'src/types/cursor/cursorCoordinate';
import { CursorSelection } from 'src/types/selection/cursorSelection';

export interface TestCase {
  name: string;
  text: string;
  cursorCoordinate: CursorCoordinate | undefined;
  expected: CursorSelection | undefined;
}

export const testCases: TestCase[] = [
  {
    name: 'basic input',
    text: [
      'Alice was beginning to get very tired of sitting by her sister on the bank',
      'and, of having nothing to do.',
    ].join('\n'),
    cursorCoordinate: {
      lineIndex: 1,
      charIndex: 12,
    },
    expected: {
      fixed: {
        lineIndex: 1,
        charIndex: 0,
      },
      free: {
        lineIndex: 1,
        charIndex: 29,
      },
    },
  },
  {
    name: 'empty text',
    text: '',
    cursorCoordinate: {
      lineIndex: 0,
      charIndex: 0,
    },
    expected: undefined,
  },
  {
    name: 'undefined cursorCoordinate',
    text: [
      'Alice was beginning to get very tired of sitting by her sister on the bank',
      'and, of having nothing to do.',
    ].join('\n'),
    cursorCoordinate: undefined,
    expected: undefined,
  },
];
