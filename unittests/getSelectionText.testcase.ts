import { CursorSelection } from 'src/types/selection/cursorSelection';

export interface TestCase {
  name: string;
  text: string;
  cursorSelection: CursorSelection | undefined;
  expected: string;
}

export const testCases: TestCase[] = [
  {
    name: 'fixed.lineIndex < free.lineIndex',
    text: [
      'Alice was beginning to get very tired of sitting by her sister on the bank',
      'and, of having nothing to do.',
    ].join('\n'),
    cursorSelection: {
      fixed: {
        lineIndex: 0,
        charIndex: 66,
      },
      free: {
        lineIndex: 1,
        charIndex: 2,
      },
    },
    expected: ['the bank', 'an'].join('\n'),
  },
  {
    name: 'fixed.lineIndex > free.lineIndex',
    text: [
      'Alice was beginning to get very tired of sitting by her sister on the bank',
      'and, of having nothing to do.',
    ].join('\n'),
    cursorSelection: {
      fixed: {
        lineIndex: 1,
        charIndex: 6,
      },
      free: {
        lineIndex: 0,
        charIndex: 68,
      },
    },
    expected: ['e bank', 'and, o'].join('\n'),
  },
  {
    name: 'fixed.charIndex <= free.charIndex',
    text: [
      'Alice was beginning to get very tired of sitting by her sister on the bank',
      'and, of having nothing to do.',
    ].join('\n'),
    cursorSelection: {
      fixed: {
        lineIndex: 0,
        charIndex: 29,
      },
      free: {
        lineIndex: 0,
        charIndex: 53,
      },
    },
    expected: 'ry tired of sitting by h',
  },
  {
    name: 'fixed.charIndex > free.charIndex',
    text: [
      'Alice was beginning to get very tired of sitting by her sister on the bank',
      'and, of having nothing to do.',
    ].join('\n'),
    cursorSelection: {
      fixed: {
        lineIndex: 0,
        charIndex: 43,
      },
      free: {
        lineIndex: 0,
        charIndex: 18,
      },
    },
    expected: 'g to get very tired of si',
  },
];
