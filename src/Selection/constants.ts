import styles from './style.css';
import { Position } from './types';

export const SelectionConstants = {
  div: {
    className: styles.selection,
    testId: 'selection',
    style: (position: Position): React.CSSProperties => ({
      top: `${position.top}px`,
      left: `${position.left}px`,
      width: `${position.width}px`,
      height: `${position.height}px`,
    }),
  },
};
