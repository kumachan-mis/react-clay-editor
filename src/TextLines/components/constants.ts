import { mergeClassNames } from '../../common/utils';

import styles from './style.css';

export const ComponentConstants = {
  header: {
    className: (size: 'normal' | 'larger' | 'largest'): string => mergeClassNames(styles.header, styles[size]),
    selectId: 'header',
    selectIdRegex: /header/,
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
    active: { className: styles.active },
  },
};
