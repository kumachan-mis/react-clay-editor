import { TextDecoration } from './types';
import { DecorationStyle } from './parser/types';

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

export const defaultFormulaStyle: React.CSSProperties = {
  fontFamily: 'SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace',
  backgroundColor: 'rgba(27, 31, 35, 0.05)',
};

export const TextLinesConstants = {
  className: 'React-Realtime-Markup-Editor-textlines',
  quotation: {
    content: {
      style: {
        backgroundColor: 'rgba(125,128,128,0.1)',
        borderLeft: 'solid 4px #a0a0a0',
        paddingLeft: '4px',
        fontStyle: 'italic',
      } as React.CSSProperties,
    },
  },
  itemization: {
    dot: {
      className: 'React-Realtime-Markup-Editor-textlines-indent-dot',
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
  lineGroup: {
    className: (from: number, to: number): string =>
      `React-Realtime-Markup-Editor-linegroup L${from}-${to}`,
    classNameRegex: /React-Realtime-Markup-Editor-linegroup L(?<from>\d+)-(?<to>\d+)/,
    indent: {
      className: 'React-Realtime-Markup-Editor-textlines-indent',
      style: (indentDepth: number): React.CSSProperties => ({ width: `${1.5 * indentDepth}em` }),
    },
    pad: {
      className: 'React-Realtime-Markup-Editor-textlines-indent-pad',
    },
    content: {
      className: 'React-Realtime-Markup-Editor-textlines-content',
      style: (indentDepth: number): React.CSSProperties => ({
        marginLeft: `${1.5 * indentDepth}em`,
      }),
    },
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
      style: (indentDepth: number): React.CSSProperties => ({
        marginLeft: `${1.5 * indentDepth}em`,
      }),
    },
    style: (defaultFontSize: number): React.CSSProperties => ({
      fontSize: `${defaultFontSize}px`,
      minHeight: `${defaultFontSize}px`,
    }),
  },
  charGroup: {
    className: (lineIndex: number, from: number, to: number): string =>
      `React-Realtime-Markup-Editor-chargroup L${lineIndex}C${from}-${to}`,
    classNameRegex: /React-Realtime-Markup-Editor-chargroup L(?<lineIndex>\d+)C(?<from>\d+)-(?<to>\d+)/,
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
    blockCodeMeta: /^(?<indent>[ \t\u3000]*)(?<codeMeta>```)$/,
    blockCodeLine: (indentDepth: number): RegExp =>
      RegExp(`^(?<indent>[ \\t\\u3000]{${indentDepth}})(?<codeLine>.*)$`),
    blockFormulaMeta: /^(?<indent>[ \t\u3000]*)(?<formulaMeta>\$\$)$/,
    blockFormulaLine: (indentDepth: number): RegExp =>
      RegExp(`^(?<indent>[ \\t\\u3000]{${indentDepth}})(?<formulaLine>.*)$`),
    quotation: /^(?<indent>[ \t\u3000]*)>(?<content>.*)$/,
    itemization: /^(?<indent>[ \t\u3000]*)(?<content>([^ \t\u3000].*)?)$/,
    inlineCode: /^(?<left>.*?)`(?<code>[^`]+)`(?<right>.*)$/,
    displayFormula: /^(?<left>.*?)\$\$(?<formula>[^$]+)\$\$(?<right>.*)$/,
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
