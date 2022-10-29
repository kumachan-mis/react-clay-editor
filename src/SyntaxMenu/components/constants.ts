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
      selectId: 'dropdown-anchor-button',
    },
    arrow: {
      className: mergeClassNames(styles.iconButton, styles.dropdownArrow),
      selectId: 'dropdown-anchor-arrow',
    },
  },
  dropdownMenuList: {
    className: mergeClassNames(styles.dropdownMenu, styles.absolute),
    selectId: 'dropdown-menu-list',
    container: {
      className: styles.dropdownMenuContainer,
    },
  },
  dropdownMenuItem: {
    className: styles.dropdownMenuItem,
  },
  active: {
    className: styles.menuActive,
  },
  disabled: {
    className: styles.disabled,
  },
};
