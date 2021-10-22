import { Position } from './types';
import styles from './style.css';

export const SelectionConstants = {
  div: {
    className: styles.selection,
    selectId: 'selection',
    style: (position: Position): React.CSSProperties => ({
      top: `${position.top}px`,
      left: `${position.left}px`,
      width: `${position.width}px`,
      height: `${position.height}px`,
    }),
  },
};
