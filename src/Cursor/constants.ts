export const CursorConstants = {
  rootDiv: {
    style: (
      top: number,
      left: number,
      cursorSize: number,
      hidden: boolean
    ): React.CSSProperties => ({
      top: `${top}px`,
      left: `${left}px`,
      height: `${cursorSize}px`,
      position: "absolute",
      display: hidden ? "none" : undefined,
    }),
  },
  svg: { width: "2px" },
  rect: { x: 0, y: 0, width: "1px", height: "100%" },
  textArea: {
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
      position: "absolute",
      width: `${Math.min(length, 10) * cursorSize}px`,
      height: `${cursorSize}px`,
      minHeight: `${cursorSize}px`,
      fontSize: `${cursorSize}px`,
      overflow: "hidden",
      border: "none",
      outline: "none",
      resize: "none",
      padding: "0px",
      zIndex: 10,
    }),
  },
};
