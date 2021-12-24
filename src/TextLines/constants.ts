import { mergeClassNames } from '../common/utils';

import { Decoration } from './parser/types';
import styles from './style.css';

export const defaultLinkNameRegex = /[^[\]]+/;

export const TextLinesConstants = {
  className: mergeClassNames(styles.textlines, styles.normal),
  itemization: {
    className: styles.itemBulletContent,
    bullet: {
      className: styles.itemBullet,
    },
    style: (indentDepth: number): React.CSSProperties => ({ marginLeft: `${1.5 * indentDepth}em` }),
  },
  quotation: {
    className: styles.quotation,
  },
  code: {
    className: styles.code,
  },
  formula: {
    className: styles.formula,
  },
  decoration: {
    className: (decoration: Decoration): string => {
      const classNames: string[] = [];
      classNames.push(styles[decoration.fontlevel]);
      if (decoration.bold) classNames.push(styles.bold);
      if (decoration.italic) classNames.push(styles.italic);
      if (decoration.underline) classNames.push(styles.underline);
      return mergeClassNames(...classNames);
    },
  },
  lineGroup: {
    className: styles.lineGroup,
    selectId: (first: number, last: number): string => `line-group-L${first}-${last}`,
    selectIdRegex: RegExp('line-group-L(?<first>\\d+)-(?<last>\\d+)'),
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
  charGroup: {
    className: styles.charGroup,
    selectId: (lineIndex: number, first: number, last: number): string => `char-group-L${lineIndex}C${first}-${last}`,
    selectIdRegex: RegExp('char-group-L(?<lineIndex>\\d+)C(?<first>\\d+)-(?<last>\\d+)'),
  },
  char: {
    className: styles.char,
    selectId: (lineIndex: number, charIndex: number): string => `char-L${lineIndex}C${charIndex}`,
    selectIdRegex: RegExp('char-L(?<lineIndex>\\d+)C(?<charIndex>\\d+)'),
  },
  embededLink: {
    className: styles.embededLink,
    selectId: 'embeded-link',
    hover: { className: 'hover' },
  },
  regexes: {
    bracketSyntax: {
      itemization: /^(?<indent>\s*)(?<bullet>\s)(?<content>(\S.*)?)$/,
      decoration: /^(?<left>.*?)\[(?<decoration>[*/_]+) (?<body>(\[[^\]]+\]|[^\]])+)\](?<right>.*)$/,
    },
    markdownSyntax: {
      itemization: /^(?<indent>\s*)(?<bullet>[*-] )(?<content>(.*)?)$/,
      heading: /^(?<heading>#+) (?<body>.+)$/,
      bold: /^(?<left>.*?)\*(?<body>[^*\s](.*[^*\s])?)\*(?<right>.*)$/,
      italic: /^(?<left>.*?)_(?<body>[^_\s](.*[^_\s])?)_(?<right>.*)$/,
    },
    common: {
      blockCodeMeta: /^(?<indent>\s*)(?<codeMeta>```)$/,
      blockCodeLine: (indentDepth: number): RegExp => RegExp(`^(?<indent>\\s{${indentDepth}})(?<codeLine>.*)$`),
      blockFormulaMeta: /^(?<indent>\s*)(?<formulaMeta>\$\$)$/,
      blockFormulaLine: (indentDepth: number): RegExp => RegExp(`^(?<indent>\\s{${indentDepth}})(?<formulaLine>.*)$`),
      quotation: /^(?<indent>\s*)(?<meta>> )(?<content>.*)$/,
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
