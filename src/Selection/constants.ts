export const SelectionConstants = {
  div: {
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
      position: "absolute",
      backgroundColor: "#accef7",
      opacity: 0.5,
    }),
  },
};
