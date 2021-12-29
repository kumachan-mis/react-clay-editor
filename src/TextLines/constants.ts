import { mergeClassNames } from '../common/utils';

import { Decoration } from './parser/types';
import styles from './style.css';

export const defaultLinkNameRegex = /[^[\]]+/;

export const TextLinesConstants = {
  className: mergeClassNames(styles.textlines, styles.normal),
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
