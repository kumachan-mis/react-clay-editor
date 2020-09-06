export const CursorConstants = {
  rootDiv: {
    className: "React-Realtime-Markup-Editor-cursor",
    style: (top: number, left: number, cursorSize: number): React.CSSProperties => ({
      top: `${top}px`,
      left: `${left}px`,
      height: `${cursorSize}px`,
    }),
  },
  svg: { width: "2px" },
  rect: { x: 0, y: 0, width: "1px", height: "100%" },
  textArea: {
    className: "React-Realtime-Markup-Editor-cursor",
    wrap: "off",
    spellCheck: false,
    autoCapitalize: "none",
    style: (
      top: number,
      left: number,
      cursorSize: number,
      length: number
    ): React.CSSProperties => ({
      top: `${top}px`,
      left: `${left}px`,
      width: `${Math.min(length, 10) * cursorSize}px`,
      height: `${cursorSize}px`,
      minHeight: `${cursorSize}px`,
      fontSize: `${cursorSize}px`,
    }),
  },
};
