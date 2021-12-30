import { mergeClassNames } from '../../common/utils';

import styles from './style.css';

export const ComponentConstants = {
  menuContainer: {
    className: styles.container,
  },
  iconButtonMenu: {
    className: styles.iconButton,
  },
  dropdownMenuAnchor: {
    className: styles.dropdownAnchor,
    icon: {
      className: mergeClassNames(styles.iconButton, styles.dropdownIcon),
      testId: 'dropdown-anchor-icon',
    },
    arrow: {
      className: mergeClassNames(styles.iconButton, styles.dropdownArrow),
      testId: 'dropdown-anchor-arrow',
    },
  },
  dropdownMenuList: {
    className: mergeClassNames(styles.dropdownMenu, styles.absolute),
  },
  dropdownMenuItem: {
    className: styles.dropdownMenuItem,
  },
  disabled: {
    className: styles.disabled,
  },
};
