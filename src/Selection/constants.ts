export const SelectionConstants = {
  div: {
    className: "React-Realtime-Markup-Editor-selection",
    style: (position: {
      top: number;
      left: number;
      width: number;
      height: number;
    }): React.CSSProperties => ({
      top: `${position.top}px`,
      left: `${position.left}px`,
      width: `${position.width}px`,
      height: `${position.height}px`,
    }),
  },
};
