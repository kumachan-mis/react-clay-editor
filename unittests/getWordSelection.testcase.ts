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
        charIndex: 8,
      },
      free: {
        lineIndex: 1,
        charIndex: 14,
      },
    },
  },
  {
    name: 'border left',
    text: [
      'Alice was beginning to get very tired of sitting by her sister on the bank',
      'and, of having nothing to do.',
    ].join('\n'),
    cursorCoordinate: {
      lineIndex: 1,
      charIndex: 0,
    },
    expected: {
      fixed: {
        lineIndex: 1,
        charIndex: 0,
      },
      free: {
        lineIndex: 1,
        charIndex: 3,
      },
    },
  },
  {
    name: 'border right',
    text: [
      'Alice was beginning to get very tired of sitting by her sister on the bank',
      'and, of having nothing to do.',
    ].join('\n'),
    cursorCoordinate: {
      lineIndex: 0,
      charIndex: 74,
    },
    expected: {
      fixed: {
        lineIndex: 0,
        charIndex: 70,
      },
      free: {
        lineIndex: 0,
        charIndex: 74,
      },
    },
  },
  {
    name: 'both of sides are not word',
    text: [
      'Alice was beginning to get very tired of sitting by her sister on the bank',
      'and, of having nothing to do.',
    ].join('\n'),
    cursorCoordinate: {
      lineIndex: 1,
      charIndex: 4,
    },
    expected: undefined,
  },
  {
    name: 'after period',
    text: [
      'Alice was beginning to get very tired of sitting by her sister on the bank',
      'and, of having nothing to do.',
    ].join('\n'),
    cursorCoordinate: {
      lineIndex: 1,
      charIndex: 29,
    },
    expected: undefined,
  },
];
