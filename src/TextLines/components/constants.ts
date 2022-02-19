import { mergeClassNames } from '../../common/utils';

import styles from './style.css';

export const ComponentConstants = {
  lineGroup: {
    className: styles.lineGroup,
    selectId: (first: number, last: number): string => `line-group-L${first}-${last}`,
    selectIdRegex: RegExp('line-group-L(?<first>\\d+)-(?<last>\\d+)'),
    testId: (first: number, last: number): string => `line-group-L${first}-${last}`,
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
    testId: (lineIndex: number): string => `line-L${lineIndex}`,
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
    testId: (lineIndex: number, first: number, last: number): string => `char-group-L${lineIndex}C${first}-${last}`,
  },
  char: {
    className: styles.char,
    selectId: (lineIndex: number, charIndex: number): string => `char-L${lineIndex}C${charIndex}`,
    selectIdRegex: RegExp('char-L(?<lineIndex>\\d+)C(?<charIndex>\\d+)'),
    testId: (lineIndex: number, charIndex: number): string => `char-L${lineIndex}C${charIndex}`,
  },
  itemization: {
    className: styles.itemBulletContent,
    bullet: {
      className: styles.itemBullet,
    },
    style: (indentDepth: number): React.CSSProperties => ({ marginLeft: `${1.5 * indentDepth}em` }),
  },
  embededLink: {
    className: styles.embededLink,
    selectId: 'embeded-link',
    testId: 'embeded-link',
    active: { className: styles.active },
  },
};
