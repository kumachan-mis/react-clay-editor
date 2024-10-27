import { HeadingNode } from '../src/parser/heading/headingNoode';

export type TestCase = {
  name: string;
  headingNode: HeadingNode;
  expected: string;
};

export const testCases: TestCase[] = [
  {
    name: 'single content node',
    headingNode: {
      type: 'heading',
      lineId: 'ab12dc58-1b1d-4b3b-8b3b-1b1d4b3b8b3b',
      contentLength: 8,
      children: [
        {
          type: 'decoration',
          range: [0, 7],
          facingMeta: '[** ',
          children: [
            {
              type: 'normal',
              range: [4, 6],
              text: 'abc',
            },
          ],
          trailingMeta: ']',
          config: {
            size: 'larger',
            bold: true,
            italic: false,
            underline: false,
          },
        },
      ],
      _lineIndex: 0,
    },
    expected: 'abc',
  },
  {
    name: 'multiple content nodes',
    headingNode: {
      type: 'heading',
      lineId: 'ab12dc58-1b1d-4b3b-8b3b-1b1d4b3b8b3b',
      contentLength: 13,
      children: [
        {
          type: 'decoration',
          range: [0, 12],
          facingMeta: '[** ',
          children: [
            {
              type: 'normal',
              range: [4, 7],
              text: 'abc ',
            },
            {
              type: 'hashtag',
              range: [8, 11],
              facingMeta: '#',
              linkName: 'def',
              trailingMeta: '',
            },
          ],
          trailingMeta: ']',
          config: {
            size: 'larger',
            bold: true,
            italic: false,
            underline: false,
          },
        },
      ],
      _lineIndex: 0,
    },
    expected: 'abc #def',
  },
];
