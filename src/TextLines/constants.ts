import { Decoration } from './parser/types';
import styles from './style.css';
import { mergeClassNames } from '../common/utils';

export const defaultLinkNameRegex = /[^[\]]+/;

export const TextLinesConstants = {
  className: styles.textlines,
  quotation: {
    className: styles.quotation,
  },
  code: {
    className: styles.code,
  },
  formula: {
    className: styles.formula,
  },
  embededLink: {
    className: styles.embededLink,
  },
  decoration: {
    className: (decoration: Decoration): string => {
      const classNames: string[] = [];
      if (decoration.fontlevel != 'normal') classNames.push(styles[decoration.fontlevel]);
      if (decoration.bold) classNames.push(styles.bold);
      if (decoration.italic) classNames.push(styles.italic);
      if (decoration.underline) classNames.push(styles.underline);
      return mergeClassNames(...classNames);
    },
  },
  lineGroup: {
    className: styles.lineGroup,
    selectId: (from: number, to: number): string => `line-group-L${from}-${to}`,
    selectIdRegex: RegExp('line-group-L(?<from>\\d+)-(?<to>\\d+)'),
    indent: {
      className: styles.indent,
      style: (indentDepth: number): React.CSSProperties => ({ width: `${1.5 * indentDepth}em` }),
    },
    pad: {
      className: styles.indentPad,
    },
    content: {
      className: styles.content,
      style: (indentDepth: number): React.CSSProperties => ({ marginLeft: `${1.5 * indentDepth}em` }),
    },
  },
  line: {
    className: mergeClassNames(styles.line, styles.normal),
    selectId: (lineIndex: number): string => `line-L${lineIndex}`,
    selectIdRegex: RegExp('line-L(?<lineIndex>\\d+)'),
    indent: {
      className: styles.indent,
      style: (indentDepth: number): React.CSSProperties => ({ width: `${1.5 * indentDepth}em` }),
    },
    indentPad: {
      className: styles.indentPad,
    },
    content: {
      className: styles.content,
      style: (indentDepth: number): React.CSSProperties => ({ marginLeft: `${1.5 * indentDepth}em` }),
    },
  },
  itemization: {
    bullet: {
      className: styles.itemBullet,
    },
  },
  charGroup: {
    className: styles.charGroup,
    selectId: (lineIndex: number, from: number, to: number): string => `char-group-L${lineIndex}C${from}-${to}`,
    selectIdRegex: RegExp('char-group-L(?<lineIndex>\\d+)C(?<from>\\d+)-(?<to>\\d+)'),
  },
  char: {
    className: styles.char,
    selectId: (lineIndex: number, charIndex: number): string => `char-L${lineIndex}C${charIndex}`,
    selectIdRegex: RegExp('char-L(?<lineIndex>\\d+)C(?<charIndex>\\d+)'),
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
      hashTag: /^(?<left>.*?)(?<hashTag>#[^\s!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~]+)(?<right>.*)$/,
      normal: /^(?<text>.+)$/,
    },
  },
  wordRegex: /[^\s!"#$%&'()*+,-./:;<=>?@[\\\]^`{|}~]+/,
};
