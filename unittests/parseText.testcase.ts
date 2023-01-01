import { ParsingOptions, TextNode } from 'src/parser';
import { createTaggedLinkRegex } from 'src/parser/taggedLink/parseTaggedLink';

type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[] ? RecursivePartial<U>[] : RecursivePartial<T[P]>;
};

export interface TestCase {
  name: string;
  text: string;
  parsingOptions?: ParsingOptions;
  expected: RecursivePartial<TextNode>[];
}

export const commonTestCases: TestCase[] = [
  {
    name: 'quotation',
    text: [
      '> Genius is one percent inspiration and ninety-nine percent perspiration',
      ' > Anyone who has never made a mistake has never tried anything new',
    ].join('\n'),
    expected: [
      {
        type: 'quotation',
        lineIndex: 0,
        indentDepth: 0,
        children: [
          {
            type: 'normal',
            lineIndex: 0,
            range: [2, 71],
            text: 'Genius is one percent inspiration and ninety-nine percent perspiration',
          },
        ],
      },
      {
        type: 'quotation',
        indentDepth: 1,
        children: [
          {
            type: 'normal',
            text: 'Anyone who has never made a mistake has never tried anything new',
          },
        ],
      },
    ],
  },
  {
    name: 'code',
    text: [
      "`import { EditorRoot } from 'react-clay-editor'`",
      '```',
      'const App: React.FC = () => {',
      '  return <></>;',
      '};',
      '```',
      '```',
      'function square(x: number): number {',
      '  return x*x;',
      '}',
      '  ```',
      '  function cube(x: number): number {',
      '    return x*x*x;',
      '  }',
      '// This is actually a normal text',
    ].join('\n'),
    expected: [
      {
        type: 'normalLine',
        lineIndex: 0,
        children: [
          {
            type: 'inlineCode',
            lineIndex: 0,
            range: [0, 47],
            code: "import { EditorRoot } from 'react-clay-editor'",
          },
        ],
      },
      {
        type: 'blockCode',
        range: [1, 5],
        facingMeta: {
          type: 'blockCodeMeta',
          lineIndex: 1,
          indentDepth: 0,
        },
        children: [
          {
            type: 'blockCodeLine',
            lineIndex: 2,
            indentDepth: 0,
            codeLine: 'const App: React.FC = () => {',
          },
          {
            type: 'blockCodeLine',
            lineIndex: 3,
            indentDepth: 0,
            codeLine: '  return <></>;',
          },
          {
            type: 'blockCodeLine',
            lineIndex: 4,
            indentDepth: 0,
            codeLine: '};',
          },
        ],
        trailingMeta: {
          type: 'blockCodeMeta',
          lineIndex: 5,
          indentDepth: 0,
        },
      },
      {
        type: 'blockCode',
        range: [6, 9],
        facingMeta: {
          type: 'blockCodeMeta',
          lineIndex: 6,
          indentDepth: 0,
        },
        children: [
          {
            type: 'blockCodeLine',
            lineIndex: 7,
            indentDepth: 0,
            codeLine: 'function square(x: number): number {',
          },
          {
            type: 'blockCodeLine',
            lineIndex: 8,
            indentDepth: 0,
            codeLine: '  return x*x;',
          },
          {
            type: 'blockCodeLine',
            lineIndex: 9,
            indentDepth: 0,
            codeLine: '}',
          },
        ],
      },
      {
        type: 'blockCode',
        facingMeta: {
          type: 'blockCodeMeta',
          indentDepth: 2,
        },
        children: [
          {
            type: 'blockCodeLine',
            indentDepth: 2,
            codeLine: 'function cube(x: number): number {',
          },
          {
            type: 'blockCodeLine',
            indentDepth: 2,
            codeLine: '  return x*x*x;',
          },
          {
            type: 'blockCodeLine',
            indentDepth: 2,
            codeLine: '}',
          },
        ],
      },
      {
        type: 'normalLine',
        children: [
          {
            type: 'normal',
            text: '// This is actually a normal text',
          },
        ],
      },
    ],
  },
  {
    name: 'formula',
    text: [
      '$f(x)$',
      '$$\\int_a^b f(x) dx$$',
      '$$',
      '\\int_a^b f(x) dx',
      '$$',
      '$$',
      '\\sum_{n=1}^N a_n',
      '  $$',
      '  \\sum_{m=1}^M b_m',
      'c_n',
    ].join('\n'),
    expected: [
      {
        type: 'normalLine',
        lineIndex: 0,
        children: [
          {
            type: 'inlineFormula',
            lineIndex: 0,
            range: [0, 5],
            formula: 'f(x)',
          },
        ],
      },
      {
        type: 'normalLine',
        lineIndex: 1,
        children: [
          {
            type: 'displayFormula',
            lineIndex: 1,
            range: [0, 19],
            formula: '\\int_a^b f(x) dx',
          },
        ],
      },
      {
        type: 'blockFormula',
        range: [2, 4],
        facingMeta: {
          type: 'blockFormulaMeta',
          lineIndex: 2,
          indentDepth: 0,
        },
        children: [
          {
            type: 'blockFormulaLine',
            lineIndex: 3,
            indentDepth: 0,
            formulaLine: '\\int_a^b f(x) dx',
          },
        ],
        trailingMeta: {
          type: 'blockFormulaMeta',
          lineIndex: 4,
          indentDepth: 0,
        },
      },
      {
        type: 'blockFormula',
        range: [5, 6],
        facingMeta: {
          type: 'blockFormulaMeta',
          lineIndex: 5,
          indentDepth: 0,
        },
        children: [
          {
            type: 'blockFormulaLine',
            lineIndex: 6,
            indentDepth: 0,
            formulaLine: '\\sum_{n=1}^N a_n',
          },
        ],
      },
      {
        type: 'blockFormula',
        facingMeta: {
          type: 'blockFormulaMeta',
          indentDepth: 2,
        },
        children: [
          {
            type: 'blockFormulaLine',
            indentDepth: 2,
            formulaLine: '\\sum_{m=1}^M b_m',
          },
        ],
      },
      {
        type: 'normalLine',
        children: [
          {
            type: 'normal',
            text: 'c_n',
          },
        ],
      },
    ],
  },
  {
    name: 'tagged link',
    text: ['[@: tagged link test]'].join('\n'),
    parsingOptions: {
      taggedLinkRegexes: [createTaggedLinkRegex('@')],
    },
    expected: [
      {
        type: 'normalLine',
        lineIndex: 0,
        children: [
          {
            type: 'taggedLink',
            lineIndex: 0,
            range: [0, 20],
            linkName: 'tagged link test',
          },
        ],
      },
    ],
  },
  {
    name: 'bracket link',
    text: ['[bracket test]'].join('\n'),
    expected: [
      {
        type: 'normalLine',
        lineIndex: 0,
        children: [
          {
            type: 'bracketLink',
            lineIndex: 0,
            range: [0, 13],
            linkName: 'bracket test',
          },
        ],
      },
    ],
  },
  {
    name: 'hashtag link',
    text: ['#hashtagtest, #hashtag_test, #hashtag-test.'].join('\n'),
    expected: [
      {
        type: 'normalLine',
        lineIndex: 0,
        children: [
          {
            type: 'hashtag',
            lineIndex: 0,
            range: [0, 11],
            facingMeta: '#',
            linkName: 'hashtagtest',
            trailingMeta: '',
          },
          {
            type: 'normal',
            text: ', ',
          },
          {
            type: 'hashtag',
            lineIndex: 0,
            range: [14, 26],
            facingMeta: '#',
            linkName: 'hashtag_test',
            trailingMeta: '',
          },
          {
            type: 'normal',
            text: ', ',
          },
          {
            type: 'hashtag',
            lineIndex: 0,
            range: [29, 41],
            facingMeta: '#',
            linkName: 'hashtag-test',
            trailingMeta: '',
          },
          {
            type: 'normal',
            text: '.',
          },
        ],
      },
    ],
  },
  {
    name: 'url text',
    text: ['https://example.com'].join('\n'),
    expected: [
      {
        type: 'normalLine',
        lineIndex: 0,
        children: [
          {
            type: 'url',
            lineIndex: 0,
            range: [0, 18],
            url: 'https://example.com',
          },
        ],
      },
    ],
  },
  {
    name: 'normal text',
    text: ['hello world'].join('\n'),
    expected: [
      {
        type: 'normalLine',
        lineIndex: 0,
        children: [
          {
            type: 'normal',
            lineIndex: 0,
            range: [0, 10],
            text: 'hello world',
          },
        ],
      },
    ],
  },
  {
    name: 'left and right',
    text: [
      'left `code` right',
      'left $f(x)$ right',
      'left [@: tagged link] right',
      'left [bracket link] right',
      'left #hashtag_link right',
      'left https://test.com right',
    ].join('\n'),
    parsingOptions: {
      taggedLinkRegexes: [createTaggedLinkRegex('@')],
    },
    expected: [
      {
        type: 'normalLine',
        lineIndex: 0,
        children: [
          {
            type: 'normal',
            lineIndex: 0,
            range: [0, 4],
            text: 'left ',
          },
          {
            type: 'inlineCode',
            lineIndex: 0,
            range: [5, 10],
            code: 'code',
          },
          {
            type: 'normal',
            lineIndex: 0,
            range: [11, 16],
            text: ' right',
          },
        ],
      },
      {
        type: 'normalLine',
        lineIndex: 1,
        children: [
          {
            type: 'normal',
            lineIndex: 1,
            range: [0, 4],
            text: 'left ',
          },
          {
            type: 'inlineFormula',
            lineIndex: 1,
            range: [5, 10],
            formula: 'f(x)',
          },
          {
            type: 'normal',
            lineIndex: 1,
            range: [11, 16],
            text: ' right',
          },
        ],
      },
      {
        type: 'normalLine',
        lineIndex: 2,
        children: [
          {
            type: 'normal',
            lineIndex: 2,
            range: [0, 4],
            text: 'left ',
          },
          {
            type: 'taggedLink',
            lineIndex: 2,
            range: [5, 20],
            linkName: 'tagged link',
          },
          {
            type: 'normal',
            lineIndex: 2,
            range: [21, 26],
            text: ' right',
          },
        ],
      },
      {
        type: 'normalLine',
        lineIndex: 3,
        children: [
          {
            type: 'normal',
            lineIndex: 3,
            range: [0, 4],
            text: 'left ',
          },
          {
            type: 'bracketLink',
            lineIndex: 3,
            range: [5, 18],
            linkName: 'bracket link',
          },
          {
            type: 'normal',
            lineIndex: 3,
            range: [19, 24],
            text: ' right',
          },
        ],
      },
      {
        type: 'normalLine',
        lineIndex: 4,
        children: [
          {
            type: 'normal',
            lineIndex: 4,
            range: [0, 4],
            text: 'left ',
          },
          {
            type: 'hashtag',
            lineIndex: 4,
            range: [5, 17],
            facingMeta: '#',
            linkName: 'hashtag_link',
            trailingMeta: '',
          },
          {
            type: 'normal',
            lineIndex: 4,
            range: [18, 23],
            text: ' right',
          },
        ],
      },
      {
        type: 'normalLine',
        lineIndex: 5,
        children: [
          {
            type: 'normal',
            lineIndex: 5,
            range: [0, 4],
            text: 'left ',
          },
          {
            type: 'url',
            lineIndex: 5,
            range: [5, 20],
            url: 'https://test.com',
          },
          {
            type: 'normal',
            lineIndex: 5,
            range: [21, 26],
            text: ' right',
          },
        ],
      },
    ],
  },
  {
    name: 'empty text',
    text: [''].join('\n'),
    expected: [
      {
        type: 'normalLine',
        children: [],
      },
    ],
  },
];

export const branketTestCases: TestCase[] = [
  {
    name: 'decoration text',
    text: [
      '[**** Largest Text][*** Also Largest Text][** Larger Text][* bold text][/ italic text][_ underlined text]',
      '[*/ bold italic text][/* italic bold text][*// bold italic text]',
      '[*_ bold underlined text][_* underlined bold text][*__ bold underlined text]',
      '[/_ italic underlined text][_/ underlined italic text]',
      '[*/_ bold italic underlined text]',
    ].join('\n'),
    expected: [
      {
        type: 'normalLine',
        lineIndex: 0,
        children: [
          {
            type: 'decoration',
            lineIndex: 0,
            range: [0, 18],
            children: [
              {
                type: 'normal',
                lineIndex: 0,
                range: [6, 17],
                text: 'Largest Text',
              },
            ],
            decoration: {
              size: 'largest',
              bold: true,
              italic: false,
              underline: false,
            },
          },
          {
            type: 'decoration',
            lineIndex: 0,
            range: [19, 41],
            children: [
              {
                type: 'normal',
                lineIndex: 0,
                range: [24, 40],
                text: 'Also Largest Text',
              },
            ],
            decoration: {
              size: 'largest',
              bold: true,
              italic: false,
              underline: false,
            },
          },
          {
            type: 'decoration',
            lineIndex: 0,
            range: [42, 57],
            children: [
              {
                type: 'normal',
                lineIndex: 0,
                range: [46, 56],
                text: 'Larger Text',
              },
            ],
            decoration: {
              size: 'larger',
              bold: true,
              italic: false,
              underline: false,
            },
          },
          {
            type: 'decoration',
            lineIndex: 0,
            range: [58, 70],
            children: [
              {
                type: 'normal',
                lineIndex: 0,
                range: [61, 69],
                text: 'bold text',
              },
            ],
            decoration: {
              size: 'normal',
              bold: true,
              italic: false,
              underline: false,
            },
          },
          {
            type: 'decoration',
            lineIndex: 0,
            range: [71, 85],
            children: [
              {
                type: 'normal',
                lineIndex: 0,
                range: [74, 84],
                text: 'italic text',
              },
            ],
            decoration: {
              size: 'normal',
              bold: false,
              italic: true,
              underline: false,
            },
          },
          {
            type: 'decoration',
            lineIndex: 0,
            range: [86, 104],
            children: [
              {
                type: 'normal',
                lineIndex: 0,
                range: [89, 103],
                text: 'underlined text',
              },
            ],
            decoration: {
              size: 'normal',
              bold: false,
              italic: false,
              underline: true,
            },
          },
        ],
      },
      {
        type: 'normalLine',
        children: [
          {
            type: 'decoration',
            children: [
              {
                type: 'normal',
                text: 'bold italic text',
              },
            ],
            decoration: {
              size: 'normal',
              bold: true,
              italic: true,
              underline: false,
            },
          },
          {
            type: 'decoration',
            children: [
              {
                type: 'normal',
                text: 'italic bold text',
              },
            ],
            decoration: {
              size: 'normal',
              bold: true,
              italic: true,
              underline: false,
            },
          },
          {
            type: 'decoration',
            children: [
              {
                type: 'normal',
                text: 'bold italic text',
              },
            ],
            decoration: {
              size: 'normal',
              bold: true,
              italic: true,
              underline: false,
            },
          },
        ],
      },
      {
        type: 'normalLine',
        children: [
          {
            type: 'decoration',
            children: [
              {
                type: 'normal',
                text: 'bold underlined text',
              },
            ],
            decoration: {
              size: 'normal',
              bold: true,
              italic: false,
              underline: true,
            },
          },
          {
            type: 'decoration',
            children: [
              {
                type: 'normal',
                text: 'underlined bold text',
              },
            ],
            decoration: {
              size: 'normal',
              bold: true,
              italic: false,
              underline: true,
            },
          },
          {
            type: 'decoration',
            children: [
              {
                type: 'normal',
                text: 'bold underlined text',
              },
            ],
            decoration: {
              size: 'normal',
              bold: true,
              italic: false,
              underline: true,
            },
          },
        ],
      },
      {
        type: 'normalLine',
        children: [
          {
            type: 'decoration',
            children: [
              {
                type: 'normal',
                text: 'italic underlined text',
              },
            ],
            decoration: {
              size: 'normal',
              bold: false,
              italic: true,
              underline: true,
            },
          },
          {
            type: 'decoration',
            children: [
              {
                type: 'normal',
                text: 'underlined italic text',
              },
            ],
            decoration: {
              size: 'normal',
              bold: false,
              italic: true,
              underline: true,
            },
          },
        ],
      },
      {
        type: 'normalLine',
        children: [
          {
            type: 'decoration',
            children: [
              {
                type: 'normal',
                text: 'bold italic underlined text',
              },
            ],
            decoration: {
              size: 'normal',
              bold: true,
              italic: true,
              underline: true,
            },
          },
        ],
      },
    ],
  },
  {
    name: 'itemization',
    text: [
      ' itemized text',
      '  nested itemized text',
      '\titemized text',
      '\t\t\tnested itemized text',
      '　箇条書きテキスト',
      '　　　　ネストした箇条書きテキスト',
    ].join('\n'),
    expected: [
      {
        type: 'itemization',
        lineIndex: 0,
        indentDepth: 0,
        children: [
          {
            type: 'normal',
            lineIndex: 0,
            range: [1, 13],
            text: 'itemized text',
          },
        ],
      },
      {
        type: 'itemization',
        lineIndex: 1,
        indentDepth: 1,
        children: [
          {
            type: 'normal',
            lineIndex: 1,
            range: [2, 21],
            text: 'nested itemized text',
          },
        ],
      },
      {
        type: 'itemization',
        indentDepth: 0,
        children: [
          {
            type: 'normal',
            text: 'itemized text',
          },
        ],
      },
      {
        type: 'itemization',
        indentDepth: 2,
        children: [
          {
            type: 'normal',
            text: 'nested itemized text',
          },
        ],
      },
      {
        type: 'itemization',
        indentDepth: 0,
        children: [
          {
            type: 'normal',
            text: '箇条書きテキスト',
          },
        ],
      },
      {
        type: 'itemization',
        indentDepth: 3,
        children: [
          {
            type: 'normal',
            text: 'ネストした箇条書きテキスト',
          },
        ],
      },
    ],
  },
  {
    name: 'left and right',
    text: ['left [* decoration text] right'].join('\n'),
    expected: [
      {
        type: 'normalLine',
        lineIndex: 0,
        children: [
          {
            type: 'normal',
            lineIndex: 0,
            range: [0, 4],
            text: 'left ',
          },
          {
            type: 'decoration',
            lineIndex: 0,
            range: [5, 23],
            children: [
              {
                type: 'normal',
                range: [8, 22],
                text: 'decoration text',
              },
            ],
            decoration: {
              size: 'normal',
              bold: true,
              italic: false,
              underline: false,
            },
          },
          {
            type: 'normal',
            lineIndex: 0,
            range: [24, 29],
            text: ' right',
          },
        ],
      },
    ],
  },
];

export const markdownTestCases: TestCase[] = [
  {
    name: 'decoration text',
    text: ['# Largest Text', '## Larger Text', '### Bold Text', '#### Also Bold Text', '*bold text*_italic text_'].join(
      '\n'
    ),
    expected: [
      {
        type: 'normalLine',
        lineIndex: 0,
        children: [
          {
            type: 'decoration',
            lineIndex: 0,
            range: [0, 13],
            children: [
              {
                type: 'normal',
                lineIndex: 0,
                range: [2, 13],
                text: 'Largest Text',
              },
            ],
            decoration: {
              size: 'largest',
              bold: true,
              italic: false,
              underline: false,
            },
          },
        ],
      },
      {
        type: 'normalLine',
        children: [
          {
            type: 'decoration',
            children: [
              {
                type: 'normal',
                text: 'Larger Text',
              },
            ],
            decoration: {
              size: 'larger',
              bold: true,
              italic: false,
              underline: false,
            },
          },
        ],
      },
      {
        type: 'normalLine',
        children: [
          {
            type: 'decoration',
            children: [
              {
                type: 'normal',
                text: 'Bold Text',
              },
            ],
            decoration: {
              size: 'normal',
              bold: true,
              italic: false,
              underline: false,
            },
          },
        ],
      },
      {
        type: 'normalLine',
        children: [
          {
            type: 'decoration',
            children: [
              {
                type: 'normal',
                text: 'Also Bold Text',
              },
            ],
            decoration: {
              size: 'normal',
              bold: true,
              italic: false,
              underline: false,
            },
          },
        ],
      },
      {
        type: 'normalLine',
        lineIndex: 4,
        children: [
          {
            type: 'decoration',
            lineIndex: 4,
            range: [0, 10],
            children: [
              {
                type: 'normal',
                range: [1, 9],
                text: 'bold text',
              },
            ],
            decoration: {
              size: 'normal',
              bold: true,
              italic: false,
              underline: false,
            },
          },
          {
            type: 'decoration',
            lineIndex: 4,
            range: [11, 23],
            children: [
              {
                type: 'normal',
                lineIndex: 4,
                range: [12, 22],
                text: 'italic text',
              },
            ],
            decoration: {
              size: 'normal',
              bold: false,
              italic: true,
              underline: false,
            },
          },
        ],
      },
    ],
  },
  {
    name: 'itemization',
    text: ['- itemized text', ' - nested itemized text', '* itemized text', '\t\t* nested itemized text'].join('\n'),
    expected: [
      {
        type: 'itemization',
        lineIndex: 0,
        indentDepth: 0,
        children: [
          {
            type: 'normal',
            lineIndex: 0,
            range: [2, 14],
            text: 'itemized text',
          },
        ],
      },
      {
        type: 'itemization',
        lineIndex: 1,
        indentDepth: 1,
        children: [
          {
            type: 'normal',
            lineIndex: 1,
            range: [3, 22],
            text: 'nested itemized text',
          },
        ],
      },
      {
        type: 'itemization',
        indentDepth: 0,
        children: [
          {
            type: 'normal',
            text: 'itemized text',
          },
        ],
      },
      {
        type: 'itemization',
        indentDepth: 2,
        children: [
          {
            type: 'normal',
            text: 'nested itemized text',
          },
        ],
      },
    ],
  },
  {
    name: 'left and right',
    text: ['left *bold text* right', 'left _italic text_ right'].join('\n'),
    expected: [
      {
        type: 'normalLine',
        lineIndex: 0,
        children: [
          {
            type: 'normal',
            lineIndex: 0,
            range: [0, 4],
            text: 'left ',
          },
          {
            type: 'decoration',
            lineIndex: 0,
            range: [5, 15],
            children: [
              {
                type: 'normal',
                range: [6, 14],
                text: 'bold text',
              },
            ],
            decoration: {
              size: 'normal',
              bold: true,
              italic: false,
              underline: false,
            },
          },
          {
            type: 'normal',
            lineIndex: 0,
            range: [16, 21],
            text: ' right',
          },
        ],
      },
      {
        type: 'normalLine',
        lineIndex: 1,
        children: [
          {
            type: 'normal',
            lineIndex: 1,
            range: [0, 4],
            text: 'left ',
          },
          {
            type: 'decoration',
            lineIndex: 1,
            range: [5, 17],
            children: [
              {
                type: 'normal',
                range: [6, 16],
                text: 'italic text',
              },
            ],
            decoration: {
              size: 'normal',
              bold: false,
              italic: true,
              underline: false,
            },
          },
          {
            type: 'normal',
            lineIndex: 1,
            range: [18, 23],
            text: ' right',
          },
        ],
      },
    ],
  },
];
