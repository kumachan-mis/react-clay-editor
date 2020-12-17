import { TextDecoration, DecorationStyle } from './types';

export const defaultTextDecoration: TextDecoration = {
  fontSizes: { level1: 16, level2: 20, level3: 24 },
};

export const defaultLinkNameRegex = /[^[\]]+/;

export const defaultLinkStyle: React.CSSProperties = {
  color: '#5E8AF7',
  cursor: 'text',
};

export const defaultLinkOverriddenStyleOnHover: React.CSSProperties = {
  color: '#425A9D',
  cursor: 'pointer',
};

export const defaultCodeStyle: React.CSSProperties = {
  fontFamily: 'SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace',
  backgroundColor: 'rgba(27, 31, 35, 0.05)',
};

export const TextLinesConstants = {
  className: 'React-Realtime-Markup-Editor-textlines',
  quotation: {
    content: {
      style: (indentDepth: number): React.CSSProperties => ({
        marginLeft: `${1.5 * indentDepth}em`,
        backgroundColor: 'rgba(125,128,128,0.1)',
        borderLeft: 'solid 4px #a0a0a0',
        paddingLeft: '4px',
      }),
    },
  },
  itemization: {
    dot: {
      className: 'React-Realtime-Markup-Editor-textlines-indent-dot',
    },
    content: {
      style: (indentDepth: number): React.CSSProperties => ({
        marginLeft: `${1.5 * indentDepth}em`,
      }),
    },
  },
  blockCodeLine: {
    content: {
      style: (indentDepth: number, codeStyle?: React.CSSProperties): React.CSSProperties => ({
        ...codeStyle,
        marginLeft: `${1.5 * indentDepth}em`,
      }),
    },
  },
  decoration: {
    style: (decorationStyle: DecorationStyle): React.CSSProperties => ({
      fontSize: `${decorationStyle.fontSize}px`,
      fontWeight: decorationStyle.bold ? 'bold' : undefined,
      fontStyle: decorationStyle.italic ? 'italic' : undefined,
      borderBottom: decorationStyle.underline ? 'solid 1px' : undefined,
    }),
  },
  line: {
    className: (lineIndex: number): string => `React-Realtime-Markup-Editor-line L${lineIndex}`,
    classNameRegex: /React-Realtime-Markup-Editor-line L(?<lineIndex>\d+)/,
    indent: {
      className: 'React-Realtime-Markup-Editor-textlines-indent',
      style: (indentDepth: number): React.CSSProperties => ({ width: `${1.5 * indentDepth}em` }),
    },
    pad: {
      className: 'React-Realtime-Markup-Editor-textlines-indent-pad',
    },
    content: {
      className: 'React-Realtime-Markup-Editor-textlines-content',
    },
    style: (defaultFontSize: number): React.CSSProperties => ({
      fontSize: `${defaultFontSize}px`,
      minHeight: `${defaultFontSize}px`,
    }),
  },
  charGroup: {
    className: (lineIndex: number, from: number, to: number): string =>
      `React-Realtime-Markup-Editor-group L${lineIndex}C${from}-${to}`,
    classNameRegex: /React-Realtime-Markup-Editor-group L(?<lineIndex>\d+)C(?<from>\d+)-(?<to>\d+)/,
  },
  char: {
    className: (lineIndex: number, charIndex: number): string =>
      `React-Realtime-Markup-Editor-char L${lineIndex}C${charIndex}`,
    classNameRegex: /React-Realtime-Markup-Editor-char L(?<lineIndex>\d+)C(?<charIndex>\d+)/,
  },
  marginBottom: {
    className: 'React-Realtime-Markup-Editor-margin-bottom',
    classNameRegex: /React-Realtime-Markup-Editor-margin-bottom/,
  },
  regexes: {
    quotation: /^(?<indent>[ \t\u3000]*)>(?<content>.*)$/,
    itemization: /^(?<indent>[ \t\u3000]*)(?<content>([^ \t\u3000].*)?)$/,
    blockCodeMeta: /^(?<indent>[ \t\u3000]*)(?<meta>```)$/,
    blockCodeLine: (indentDepth: number): RegExp =>
      RegExp(`^(?<indent>[ \\t\\u3000]{${indentDepth}})(?<codeLine>.*)$`),
    inlineCode: /^(?<left>.*?)`(?<code>[^`]+)`(?<right>.*)$/,
    blockFormula: /^(?<left>.*?)\$\$(?<formula>[^$]+)\$\$(?<right>.*)$/,
    inlineFormula: /^(?<left>.*?)\$(?<formula>[^$]+)\$(?<right>.*)$/,
    decoration: /^(?<left>.*?)\[(?<decoration>[*/_]+) (?<body>(\[[^\]]+\]|[^\]])+)\](?<right>.*)$/,
    taggedLink: (tagName: string, linkNameRegex = defaultLinkNameRegex): RegExp => {
      const tag = tagName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const linkName = linkNameRegex.source;
      return RegExp(`^(?<left>.*?)\\[(?<tag>${tag}: )(?<linkName>${linkName})\\](?<right>.*)$`);
    },
    bracketLink: /^(?<left>.*?)\[(?<linkName>[^[\]]+)\](?<right>.*)$/,
    hashTag: /^(?<left>.*?)(?<hashTag>#[^ \t\u3000]+)(?<right>.*)$/,
    normal: /^(?<text>.+)$/,
  },
  wordRegex: /[^ !"#$%&'()*+,-./:;<=>?@[\\\]^`{|}~\t\u3000]+/,
};
