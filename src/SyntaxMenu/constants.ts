import { mergeClassNames } from '../common/utils';

import styles from './style.css';

export const SyntaxMenuConstants = {
  iconButton: {
    className: styles.iconButton,
  },
  dropdownAnchor: {
    className: styles.dropdownAnchor,
    icon: {
      className: mergeClassNames(styles.iconButton, styles.dropdownIcon),
    },
    arrow: {
      className: mergeClassNames(styles.iconButton, styles.dropdownArrow),
    },
  },
  dropdownMenu: {
    className: styles.dropdownMenu,
  },
  dropdownMenuItem: {
    className: styles.dropdownMenuItem,
  },
};
