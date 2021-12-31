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
    button: {
      className: mergeClassNames(styles.iconButton, styles.dropdownButton),
      testId: 'dropdown-anchor-button',
    },
    arrow: {
      className: mergeClassNames(styles.iconButton, styles.dropdownArrow),
      testId: 'dropdown-anchor-arrow',
    },
  },
  dropdownMenuList: {
    className: mergeClassNames(styles.dropdownMenu, styles.absolute),
    container: {
      className: styles.dropdownMenuContainer,
    },
  },
  dropdownMenuItem: {
    className: styles.dropdownMenuItem,
  },
  disabled: {
    className: styles.disabled,
  },
};
