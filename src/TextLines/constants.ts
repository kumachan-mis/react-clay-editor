import { DecorationSettings } from './types';
import { DecorationStyle } from './parser/types';
import styles from './style.css';

export const defaultDecorationSettings: DecorationSettings = {
  fontSizes: { normal: 16, larger: 20, largest: 24 },
};

export const defaultLinkNameRegex = /[^[\]]+/;

export const defaultLinkStyle: React.CSSProperties = {
  textDecorationLine: 'none',
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
  className: styles.textlines,
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
  decoration: {
    style: (decorationStyle: DecorationStyle): React.CSSProperties => ({
      fontSize: `${decorationStyle.fontSize}px`,
      fontWeight: decorationStyle.bold ? 'bold' : undefined,
      fontStyle: decorationStyle.italic ? 'italic' : undefined,
      borderBottom: decorationStyle.underline ? 'solid 1px' : undefined,
    }),
  },
  lineGroup: {
    className: styles.lineGroup,
    selectId: (from: number, to: number): string => `react-realtime-markup-editor__line-group-L${from}-${to}`,
    selectIdRegex: RegExp('react-realtime-markup-editor__line-group-L(?<from>\\d+)-(?<to>\\d+)'),
    indent: {
      className: styles.indent,
      style: (indentDepth: number): React.CSSProperties => ({ width: `${1.5 * indentDepth}em` }),
    },
    pad: {
      className: styles.indentPad,
    },
    content: {
      className: styles.content,
      style: (indentDepth: number): React.CSSProperties => ({
        marginLeft: `${1.5 * indentDepth}em`,
      }),
    },
  },
  line: {
    className: styles.line,
    selectId: (lineIndex: number): string => `react-realtime-markup-editor__line-L${lineIndex}`,
    selectIdRegex: RegExp('react-realtime-markup-editor__line-L(?<lineIndex>\\d+)'),
    indent: {
      className: styles.indent,
      style: (indentDepth: number): React.CSSProperties => ({ width: `${1.5 * indentDepth}em` }),
    },
    indentPad: {
      className: styles.indentPad,
    },
    content: {
      className: styles.content,
      style: (indentDepth: number): React.CSSProperties => ({
        marginLeft: `${1.5 * indentDepth}em`,
      }),
    },
    style: (defaultFontSize: number): React.CSSProperties => ({
      fontSize: `${defaultFontSize}px`,
      minHeight: `${defaultFontSize}px`,
    }),
  },
  itemization: {
    bullet: {
      className: styles.itemBullet,
    },
  },
  charGroup: {
    className: styles.charGroup,
    selectId: (lineIndex: number, from: number, to: number): string =>
      `react-realtime-markup-editor__char-group-L${lineIndex}C${from}-${to}`,
    selectIdRegex: RegExp('react-realtime-markup-editor__char-group-L(?<lineIndex>\\d+)C(?<from>\\d+)-(?<to>\\d+)'),
  },
  char: {
    className: styles.char,
    selectId: (lineIndex: number, charIndex: number): string =>
      `react-realtime-markup-editor__char-L${lineIndex}C${charIndex}`,
    selectIdRegex: RegExp('react-realtime-markup-editor__char-L(?<lineIndex>\\d+)C(?<charIndex>\\d+)'),
  },
  regexes: {
    bracketSyntax: {
      itemization: /^(?<indent>\s*)(?<bullet>\s)(?<content>(\S.*)?)$/,
      decoration: /^(?<left>.*?)\[(?<decoration>[*/_]+) (?<body>(\[[^\]]+\]|[^\]])+)\](?<right>.*)$/,
    },
    markdownSyntax: {
      itemization: /^(?<indent>\s*)(?<bullet>[*-])(?<content>(.*)?)$/,
      heading: /^(?<heading>#+) (?<body>.+)$/,
      bold: /^(?<left>.*?)\*(?<body>[^*\s](.*[^*\s])?)\*(?<right>.*)$/,
      italic: /^(?<left>.*?)_(?<body>[^_\s](.*[^_\s])?)_(?<right>.*)$/,
    },
    common: {
      blockCodeMeta: /^(?<indent>\s*)(?<codeMeta>```)$/,
      blockCodeLine: (indentDepth: number): RegExp => RegExp(`^(?<indent>\\s{${indentDepth}})(?<codeLine>.*)$`),
      blockFormulaMeta: /^(?<indent>\s*)(?<formulaMeta>\$\$)$/,
      blockFormulaLine: (indentDepth: number): RegExp => RegExp(`^(?<indent>\\s{${indentDepth}})(?<formulaLine>.*)$`),
      quotation: /^(?<indent>\s*)>(?<content>.*)$/,
      inlineCode: /^(?<left>.*?)`(?<code>[^`]+)`(?<right>.*)$/,
      displayFormula: /^(?<left>.*?)\$\$(?<formula>[^$]+)\$\$(?<right>.*)$/,
      inlineFormula: /^(?<left>.*?)\$(?<formula>[^$]+)\$(?<right>.*)$/,
      taggedLink: (tagName: string, linkNameRegex = defaultLinkNameRegex): RegExp => {
        const tag = tagName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const linkName = linkNameRegex.source;
        return RegExp(`^(?<left>.*?)\\[(?<tag>${tag}: )(?<linkName>${linkName})\\](?<right>.*)$`);
      },
      bracketLink: /^(?<left>.*?)\[(?<linkName>[^[\]]+)\](?<right>.*)$/,
      hashTag: /^(?<left>.*?)(?<hashTag>#\S+)(?<right>.*)$/,
      normal: /^(?<text>.+)$/,
    },
  },
  wordRegex: /[^\s!"#$%&'()*+,-./:;<=>?@[\\\]^`{|}~]+/,
};
