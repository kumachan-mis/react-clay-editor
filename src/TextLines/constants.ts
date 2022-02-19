import { mergeClassNames } from '../common/utils';
import { Decoration } from '../parser/types';

import styles from './style.css';

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
      classNames.push(styles[decoration.size]);
      if (decoration.bold) classNames.push(styles.bold);
      if (decoration.italic) classNames.push(styles.italic);
      if (decoration.underline) classNames.push(styles.underline);
      return mergeClassNames(...classNames);
    },
  },
};
