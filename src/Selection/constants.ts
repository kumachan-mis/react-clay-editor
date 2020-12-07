import { Position } from './types';

export const SelectionConstants = {
  div: {
    className: 'React-Realtime-Markup-Editor-selection',
    style: (position: Position): React.CSSProperties => ({
      top: `${position.top}px`,
      left: `${position.left}px`,
      width: `${position.width}px`,
      height: `${position.height}px`,
    }),
  },
};
