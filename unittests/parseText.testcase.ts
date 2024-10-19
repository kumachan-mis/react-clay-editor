import { TextNode, ParsingOptions } from '../src/parser';
import { createTaggedLinkRegex } from '../src/parser/taggedLink/parseTaggedLink';

type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[] ? RecursivePartial<U>[] : RecursivePartial<T[P]>;
};

export type TestCase = {
  name: string;
  text: string;
  parsingOptions?: ParsingOptions;
  expected: RecursivePartial<TextNode>[];
};

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
        indent: '',
        meta: '> ',
        children: [
          {
            type: 'normal',
            range: [2, 71],
            text: 'Genius is one percent inspiration and ninety-nine percent perspiration',
          },
        ],
        _lineIndex: 0,
      },
      {
        type: 'quotation',
        indent: ' ',
        meta: '> ',
        children: [
          {
            type: 'normal',
            text: 'Anyone who has never made a mistake has never tried anything new',
          },
        ],
        _lineIndex: 1,
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
      '```',
      '```',
      '  ```',
    ].join('\n'),
    expected: [
      {
        type: 'normalLine',
        children: [
          {
            type: 'inlineCode',
            range: [0, 47],
            code: "import { EditorRoot } from 'react-clay-editor'",
          },
        ],
        _lineIndex: 0,
      },
      {
        type: 'blockCode',
        facingMeta: {
          type: 'blockCodeMeta',
          indent: '',
          _lineIndex: 1,
        },
        children: [
          {
            type: 'blockCodeLine',
            indent: '',
            codeLine: 'const App: React.FC = () => {',
            _lineIndex: 2,
          },
          {
            type: 'blockCodeLine',
            indent: '',
            codeLine: '  return <></>;',
            _lineIndex: 3,
          },
          {
            type: 'blockCodeLine',
            indent: '',
            codeLine: '};',
            _lineIndex: 4,
          },
        ],
        trailingMeta: {
          type: 'blockCodeMeta',
          indent: '',
          _lineIndex: 5,
        },
      },
      {
        type: 'blockCode',
        facingMeta: {
          type: 'blockCodeMeta',
          indent: '',
          _lineIndex: 6,
        },
        children: [
          {
            type: 'blockCodeLine',
            indent: '',
            codeLine: 'function square(x: number): number {',
            _lineIndex: 7,
          },
          {
            type: 'blockCodeLine',
            indent: '',
            codeLine: '  return x*x;',
            _lineIndex: 8,
          },
          {
            type: 'blockCodeLine',
            indent: '',
            codeLine: '}',
            _lineIndex: 9,
          },
        ],
        _lineRange: [6, 9],
      },
      {
        type: 'blockCode',
        facingMeta: {
          type: 'blockCodeMeta',
          indent: '  ',
          _lineIndex: 10,
        },
        children: [
          {
            type: 'blockCodeLine',
            indent: '  ',
            codeLine: 'function cube(x: number): number {',
            _lineIndex: 11,
          },
          {
            type: 'blockCodeLine',
            indent: '  ',
            codeLine: '  return x*x*x;',
            _lineIndex: 12,
          },
          {
            type: 'blockCodeLine',
            indent: '  ',
            codeLine: '}',
            _lineIndex: 13,
          },
        ],
        _lineRange: [10, 13],
      },
      {
        type: 'normalLine',
        children: [
          {
            type: 'normal',
            text: '// This is actually a normal text',
          },
        ],
        _lineIndex: 14,
      },
      {
        type: 'blockCode',
        facingMeta: {
          type: 'blockCodeMeta',
          indent: '',
          _lineIndex: 15,
        },
        children: [],
        trailingMeta: {
          type: 'blockCodeMeta',
          indent: '',
          _lineIndex: 16,
        },
        _lineRange: [15, 16],
      },
      {
        type: 'blockCode',
        facingMeta: {
          type: 'blockCodeMeta',
          indent: '  ',
          _lineIndex: 17,
        },
        children: [],
        _lineRange: [17, 17],
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
      '$$',
      '$$',
      '  $$',
    ].join('\n'),
    expected: [
      {
        type: 'normalLine',
        children: [
          {
            type: 'inlineFormula',
            range: [0, 5],
            formula: 'f(x)',
          },
        ],
        _lineIndex: 0,
      },
      {
        type: 'normalLine',
        children: [
          {
            type: 'displayFormula',
            range: [0, 19],
            formula: '\\int_a^b f(x) dx',
          },
        ],
        _lineIndex: 1,
      },
      {
        type: 'blockFormula',
        facingMeta: {
          type: 'blockFormulaMeta',
          indent: '',
          _lineIndex: 2,
        },
        children: [
          {
            type: 'blockFormulaLine',
            indent: '',
            formulaLine: '\\int_a^b f(x) dx',
            _lineIndex: 3,
          },
        ],
        trailingMeta: {
          type: 'blockFormulaMeta',
          indent: '',
          _lineIndex: 4,
        },
      },
      {
        type: 'blockFormula',
        facingMeta: {
          type: 'blockFormulaMeta',
          indent: '',
          _lineIndex: 5,
        },
        children: [
          {
            type: 'blockFormulaLine',
            indent: '',
            formulaLine: '\\sum_{n=1}^N a_n',
            _lineIndex: 6,
          },
        ],
        _lineRange: [5, 6],
      },
      {
        type: 'blockFormula',
        facingMeta: {
          type: 'blockFormulaMeta',
          indent: '  ',
          _lineIndex: 7,
        },
        children: [
          {
            type: 'blockFormulaLine',
            indent: '  ',
            formulaLine: '\\sum_{m=1}^M b_m',
            _lineIndex: 8,
          },
        ],
        _lineRange: [7, 8],
      },
      {
        type: 'normalLine',
        children: [
          {
            type: 'normal',
            text: 'c_n',
          },
        ],
        _lineIndex: 9,
      },
      {
        type: 'blockFormula',
        facingMeta: {
          type: 'blockFormulaMeta',
          indent: '',
          _lineIndex: 10,
        },
        children: [],
        trailingMeta: {
          type: 'blockFormulaMeta',
          indent: '',
          _lineIndex: 11,
        },
        _lineRange: [10, 11],
      },
      {
        type: 'blockFormula',
        facingMeta: {
          type: 'blockFormulaMeta',
          indent: '  ',
          _lineIndex: 12,
        },
        children: [],
        _lineRange: [12, 12],
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
        children: [
          {
            type: 'taggedLink',
            range: [0, 20],
            linkName: 'tagged link test',
          },
        ],
        _lineIndex: 0,
      },
    ],
  },
  {
    name: 'bracket link',
    text: ['[bracket test]'].join('\n'),
    expected: [
      {
        type: 'normalLine',
        children: [
          {
            type: 'bracketLink',
            range: [0, 13],
            linkName: 'bracket test',
          },
        ],
        _lineIndex: 0,
      },
    ],
  },
  {
    name: 'hashtag link',
    text: ['#hashtagtest, #hashtag_test, #hashtag-test.'].join('\n'),
    expected: [
      {
        type: 'normalLine',
        children: [
          {
            type: 'hashtag',
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
        _lineIndex: 0,
      },
    ],
  },
  {
    name: 'url text',
    text: ['https://example.com'].join('\n'),
    expected: [
      {
        type: 'normalLine',
        children: [
          {
            type: 'url',
            range: [0, 18],
            url: 'https://example.com',
          },
        ],
        _lineIndex: 0,
      },
    ],
  },
  {
    name: 'normal text',
    text: ['hello world'].join('\n'),
    expected: [
      {
        type: 'normalLine',
        children: [
          {
            type: 'normal',
            range: [0, 10],
            text: 'hello world',
          },
        ],
        _lineIndex: 0,
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
        children: [
          {
            type: 'normal',
            range: [0, 4],
            text: 'left ',
          },
          {
            type: 'inlineCode',
            range: [5, 10],
            code: 'code',
          },
          {
            type: 'normal',
            range: [11, 16],
            text: ' right',
          },
        ],
        _lineIndex: 0,
      },
      {
        type: 'normalLine',
        children: [
          {
            type: 'normal',
            range: [0, 4],
            text: 'left ',
          },
          {
            type: 'inlineFormula',
            range: [5, 10],
            formula: 'f(x)',
          },
          {
            type: 'normal',
            range: [11, 16],
            text: ' right',
          },
        ],
        _lineIndex: 1,
      },
      {
        type: 'normalLine',
        children: [
          {
            type: 'normal',
            range: [0, 4],
            text: 'left ',
          },
          {
            type: 'taggedLink',
            range: [5, 20],
            linkName: 'tagged link',
          },
          {
            type: 'normal',
            range: [21, 26],
            text: ' right',
          },
        ],
        _lineIndex: 2,
      },
      {
        type: 'normalLine',
        children: [
          {
            type: 'normal',
            range: [0, 4],
            text: 'left ',
          },
          {
            type: 'bracketLink',
            range: [5, 18],
            linkName: 'bracket link',
          },
          {
            type: 'normal',
            range: [19, 24],
            text: ' right',
          },
        ],
        _lineIndex: 3,
      },
      {
        type: 'normalLine',
        children: [
          {
            type: 'normal',
            range: [0, 4],
            text: 'left ',
          },
          {
            type: 'hashtag',
            range: [5, 17],
            facingMeta: '#',
            linkName: 'hashtag_link',
            trailingMeta: '',
          },
          {
            type: 'normal',
            range: [18, 23],
            text: ' right',
          },
        ],
        _lineIndex: 4,
      },
      {
        type: 'normalLine',
        children: [
          {
            type: 'normal',
            range: [0, 4],
            text: 'left ',
          },
          {
            type: 'url',
            range: [5, 20],
            url: 'https://test.com',
          },
          {
            type: 'normal',
            range: [21, 26],
            text: ' right',
          },
        ],
        _lineIndex: 5,
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
        _lineIndex: 0,
      },
    ],
  },
];

export const branketTestCases: TestCase[] = [
  {
    name: 'heading text',
    text: ['[**** Largest Heading]', '[*** Also Largest Heading]', '[** Larger Heading]', '[* Normal Heading]'].join(
      '\n'
    ),
    expected: [
      {
        type: 'heading',
        children: [
          {
            type: 'decoration',
            range: [0, 21],
            children: [
              {
                type: 'normal',
                range: [6, 20],
                text: 'Largest Heading',
              },
            ],
            config: {
              size: 'largest',
              bold: true,
              italic: false,
              underline: false,
            },
          },
        ],
        _lineIndex: 0,
      },
      {
        type: 'heading',
        children: [
          {
            type: 'decoration',
            range: [0, 25],
            children: [
              {
                type: 'normal',
                range: [5, 24],
                text: 'Also Largest Heading',
              },
            ],
            config: {
              size: 'largest',
              bold: true,
              italic: false,
              underline: false,
            },
          },
        ],
        _lineIndex: 1,
      },
      {
        type: 'heading',
        children: [
          {
            type: 'decoration',
            range: [0, 18],
            children: [
              {
                type: 'normal',
                range: [4, 17],
                text: 'Larger Heading',
              },
            ],
            config: {
              size: 'larger',
              bold: true,
              italic: false,
              underline: false,
            },
          },
        ],
        _lineIndex: 2,
      },
      {
        type: 'heading',
        children: [
          {
            type: 'decoration',
            range: [0, 17],
            children: [
              {
                type: 'normal',
                range: [3, 16],
                text: 'Normal Heading',
              },
            ],
            config: {
              size: 'normal',
              bold: true,
              italic: false,
              underline: false,
            },
          },
        ],
        _lineIndex: 3,
      },
    ],
  },
  {
    name: 'decoration text',
    text: [
      '[**** Largest Text] ',
      '[*** Also Largest Text] ',
      '[** Larger Text] ',
      '[* bold text] ',
      '[**** Largest Text][*** Also Largest Text][** Larger Text][* bold text][/ italic text][_ underlined text]',
      '[*/ bold italic text][/* italic bold text][*// bold italic text]',
      '[*_ bold underlined text][_* underlined bold text][*__ bold underlined text]',
      '[/_ italic underlined text][_/ underlined italic text]',
      '[*/_ bold italic underlined text]',
    ].join('\n'),
    expected: [
      {
        type: 'normalLine',
        children: [
          {
            type: 'decoration',
            range: [0, 18],
            children: [
              {
                type: 'normal',
                range: [6, 17],
                text: 'Largest Text',
              },
            ],
            config: {
              size: 'largest',
              bold: true,
              italic: false,
              underline: false,
            },
          },
          {
            type: 'normal',
            range: [19, 19],
            text: ' ',
          },
        ],
        _lineIndex: 0,
      },
      {
        type: 'normalLine',
        children: [
          {
            type: 'decoration',
            range: [0, 22],
            children: [
              {
                type: 'normal',
                range: [5, 21],
                text: 'Also Largest Text',
              },
            ],
            config: {
              size: 'largest',
              bold: true,
              italic: false,
              underline: false,
            },
          },
          {
            type: 'normal',
            range: [23, 23],
            text: ' ',
          },
        ],
        _lineIndex: 1,
      },
      {
        type: 'normalLine',
        children: [
          {
            type: 'decoration',
            range: [0, 15],
            children: [
              {
                type: 'normal',
                range: [4, 14],
                text: 'Larger Text',
              },
            ],
            config: {
              size: 'larger',
              bold: true,
              italic: false,
              underline: false,
            },
          },
          {
            type: 'normal',
            range: [16, 16],
            text: ' ',
          },
        ],
        _lineIndex: 2,
      },
      {
        type: 'normalLine',
        children: [
          {
            type: 'decoration',
            range: [0, 12],
            children: [
              {
                type: 'normal',
                range: [3, 11],
                text: 'bold text',
              },
            ],
            config: {
              size: 'normal',
              bold: true,
              italic: false,
              underline: false,
            },
          },
          {
            type: 'normal',
            range: [13, 13],
            text: ' ',
          },
        ],
        _lineIndex: 3,
      },
      {
        type: 'normalLine',
        children: [
          {
            type: 'decoration',
            range: [0, 18],
            children: [
              {
                type: 'normal',
                range: [6, 17],
                text: 'Largest Text',
              },
            ],
            config: {
              size: 'largest',
              bold: true,
              italic: false,
              underline: false,
            },
          },
          {
            type: 'decoration',
            range: [19, 41],
            children: [
              {
                type: 'normal',
                range: [24, 40],
                text: 'Also Largest Text',
              },
            ],
            config: {
              size: 'largest',
              bold: true,
              italic: false,
              underline: false,
            },
          },
          {
            type: 'decoration',
            range: [42, 57],
            children: [
              {
                type: 'normal',
                range: [46, 56],
                text: 'Larger Text',
              },
            ],
            config: {
              size: 'larger',
              bold: true,
              italic: false,
              underline: false,
            },
          },
          {
            type: 'decoration',
            range: [58, 70],
            children: [
              {
                type: 'normal',
                range: [61, 69],
                text: 'bold text',
              },
            ],
            config: {
              size: 'normal',
              bold: true,
              italic: false,
              underline: false,
            },
          },
          {
            type: 'decoration',
            range: [71, 85],
            children: [
              {
                type: 'normal',
                range: [74, 84],
                text: 'italic text',
              },
            ],
            config: {
              size: 'normal',
              bold: false,
              italic: true,
              underline: false,
            },
          },
          {
            type: 'decoration',
            range: [86, 104],
            children: [
              {
                type: 'normal',
                range: [89, 103],
                text: 'underlined text',
              },
            ],
            config: {
              size: 'normal',
              bold: false,
              italic: false,
              underline: true,
            },
          },
        ],
        _lineIndex: 4,
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
            config: {
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
            config: {
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
            config: {
              size: 'normal',
              bold: true,
              italic: true,
              underline: false,
            },
          },
        ],
        _lineIndex: 5,
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
            config: {
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
            config: {
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
            config: {
              size: 'normal',
              bold: true,
              italic: false,
              underline: true,
            },
          },
        ],
        _lineIndex: 6,
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
            config: {
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
            config: {
              size: 'normal',
              bold: false,
              italic: true,
              underline: true,
            },
          },
        ],
        _lineIndex: 7,
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
            config: {
              size: 'normal',
              bold: true,
              italic: true,
              underline: true,
            },
          },
        ],
        _lineIndex: 8,
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
        indent: '',
        bullet: ' ',
        children: [
          {
            type: 'normal',
            range: [1, 13],
            text: 'itemized text',
          },
        ],
        _lineIndex: 0,
      },
      {
        type: 'itemization',
        indent: ' ',
        bullet: ' ',
        children: [
          {
            type: 'normal',
            range: [2, 21],
            text: 'nested itemized text',
          },
        ],
        _lineIndex: 1,
      },
      {
        type: 'itemization',
        indent: '',
        bullet: '\t',
        children: [
          {
            type: 'normal',
            text: 'itemized text',
          },
        ],
        _lineIndex: 2,
      },
      {
        type: 'itemization',
        indent: '\t\t',
        bullet: '\t',
        children: [
          {
            type: 'normal',
            text: 'nested itemized text',
          },
        ],
        _lineIndex: 3,
      },
      {
        type: 'itemization',
        indent: '',
        bullet: '　',
        children: [
          {
            type: 'normal',
            text: '箇条書きテキスト',
          },
        ],
        _lineIndex: 4,
      },
      {
        type: 'itemization',
        indent: '　　　',
        bullet: '　',
        children: [
          {
            type: 'normal',
            text: 'ネストした箇条書きテキスト',
          },
        ],
        _lineIndex: 5,
      },
    ],
  },
  {
    name: 'left and right',
    text: ['left [* decoration text] right'].join('\n'),
    expected: [
      {
        type: 'normalLine',
        children: [
          {
            type: 'normal',
            range: [0, 4],
            text: 'left ',
          },
          {
            type: 'decoration',
            range: [5, 23],
            children: [
              {
                type: 'normal',
                range: [8, 22],
                text: 'decoration text',
              },
            ],
            config: {
              size: 'normal',
              bold: true,
              italic: false,
              underline: false,
            },
          },
          {
            type: 'normal',
            range: [24, 29],
            text: ' right',
          },
        ],
        _lineIndex: 0,
      },
    ],
  },
];

export const markdownTestCases: TestCase[] = [
  {
    name: 'heading text',
    text: ['# Largest Heading', '## Larger Heading', '### Normal Heading', '#### Also Normal Heading'].join('\n'),
    expected: [
      {
        type: 'heading',
        children: [
          {
            type: 'decoration',
            range: [0, 16],
            children: [
              {
                type: 'normal',
                range: [2, 16],
                text: 'Largest Heading',
              },
            ],
          },
        ],
        _lineIndex: 0,
      },
      {
        type: 'heading',
        children: [
          {
            type: 'decoration',
            range: [0, 16],
            children: [
              {
                type: 'normal',
                range: [3, 16],
                text: 'Larger Heading',
              },
            ],
          },
        ],
        _lineIndex: 1,
      },
      {
        type: 'heading',
        children: [
          {
            type: 'decoration',
            range: [0, 17],
            children: [
              {
                type: 'normal',
                range: [4, 17],
                text: 'Normal Heading',
              },
            ],
          },
        ],
      },
      {
        type: 'heading',
        children: [
          {
            type: 'decoration',
            range: [0, 23],
            children: [
              {
                type: 'normal',
                range: [5, 23],
                text: 'Also Normal Heading',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'decoration text',
    text: ['*bold text*_italic text_', '*_bold italic text_*', '_*italic bold text*_'].join('\n'),
    expected: [
      {
        type: 'normalLine',
        children: [
          {
            type: 'decoration',
            range: [0, 10],
            children: [
              {
                type: 'normal',
                range: [1, 9],
                text: 'bold text',
              },
            ],
            config: {
              size: 'normal',
              bold: true,
              italic: false,
              underline: false,
            },
          },
          {
            type: 'decoration',
            range: [11, 23],
            children: [
              {
                type: 'normal',
                range: [12, 22],
                text: 'italic text',
              },
            ],
            config: {
              size: 'normal',
              bold: false,
              italic: true,
              underline: false,
            },
          },
        ],
        _lineIndex: 0,
      },
      {
        type: 'normalLine',
        children: [
          {
            type: 'decoration',
            range: [0, 19],
            children: [
              {
                type: 'normal',
                range: [2, 17],
                text: 'bold italic text',
              },
            ],
            config: {
              size: 'normal',
              bold: true,
              italic: true,
              underline: false,
            },
          },
        ],
        _lineIndex: 1,
      },
      {
        type: 'normalLine',
        children: [
          {
            type: 'decoration',
            range: [0, 19],
            children: [
              {
                type: 'normal',
                range: [2, 17],
                text: 'italic bold text',
              },
            ],
            config: {
              size: 'normal',
              bold: true,
              italic: true,
              underline: false,
            },
          },
        ],
        _lineIndex: 2,
      },
    ],
  },
  {
    name: 'itemization',
    text: ['- itemized text', ' - nested itemized text', '* itemized text', '\t\t* nested itemized text'].join('\n'),
    expected: [
      {
        type: 'itemization',
        indent: '',
        bullet: '- ',
        children: [
          {
            type: 'normal',
            range: [2, 14],
            text: 'itemized text',
          },
        ],
        _lineIndex: 0,
      },
      {
        type: 'itemization',
        indent: ' ',
        bullet: '- ',
        children: [
          {
            type: 'normal',
            range: [3, 22],
            text: 'nested itemized text',
          },
        ],
        _lineIndex: 1,
      },
      {
        type: 'itemization',
        indent: '',
        bullet: '* ',
        children: [
          {
            type: 'normal',
            text: 'itemized text',
          },
        ],
        _lineIndex: 2,
      },
      {
        type: 'itemization',
        indent: '\t\t',
        bullet: '* ',
        children: [
          {
            type: 'normal',
            text: 'nested itemized text',
          },
        ],
        _lineIndex: 3,
      },
    ],
  },
  {
    name: 'left and right',
    text: ['left *bold text* right', 'left _italic text_ right'].join('\n'),
    expected: [
      {
        type: 'normalLine',
        children: [
          {
            type: 'normal',
            range: [0, 4],
            text: 'left ',
          },
          {
            type: 'decoration',
            range: [5, 15],
            children: [
              {
                type: 'normal',
                range: [6, 14],
                text: 'bold text',
              },
            ],
            config: {
              size: 'normal',
              bold: true,
              italic: false,
              underline: false,
            },
          },
          {
            type: 'normal',
            range: [16, 21],
            text: ' right',
          },
        ],
        _lineIndex: 0,
      },
      {
        type: 'normalLine',
        children: [
          {
            type: 'normal',
            range: [0, 4],
            text: 'left ',
          },
          {
            type: 'decoration',
            range: [5, 17],
            children: [
              {
                type: 'normal',
                range: [6, 16],
                text: 'italic text',
              },
            ],
            config: {
              size: 'normal',
              bold: false,
              italic: true,
              underline: false,
            },
          },
          {
            type: 'normal',
            range: [18, 23],
            text: ' right',
          },
        ],
        _lineIndex: 1,
      },
    ],
  },
];
