import { Position, SuggestionListDecoration } from "./types";

export const defaultSuggestionListDecoration: SuggestionListDecoration = {
  width: 250,
  maxHeight: 100,
  fontSize: 14,
};

export const CursorConstants = {
  rootDiv: {
    className: "React-Realtime-Markup-Editor-cursor",
    style: (position: Position, cursorSize: number): React.CSSProperties => ({
      top: `${position.top}px`,
      left: `${position.left}px`,
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
    style: (position: Position, cursorSize: number, length: number): React.CSSProperties => ({
      top: `${position.top}px`,
      left: `${position.left}px`,
      width: `${Math.min(length, 10) * cursorSize}px`,
      height: `${cursorSize}px`,
      minHeight: `${cursorSize}px`,
      fontSize: `${cursorSize}px`,
    }),
  },
  suggestion: {
    list: {
      className: "React-Realtime-Markup-Editor-cursor-suggestion-list",
      style: (
        position: Position,
        cursorSize: number,
        width: number,
        maxHeight: number,
        hidden: boolean
      ): React.CSSProperties => ({
        top: `${position.top + cursorSize + 2}px`,
        left: `${position.left}px`,
        width: `${width}px`,
        maxHeight: `${maxHeight}px`,
        display: hidden ? "none" : undefined,
      }),
    },
    item: {
      className: "React-Realtime-Markup-Editor-cursor-suggestion-item",
      style: (fontSize: number): React.CSSProperties => ({
        fontSize: `${fontSize}px`,
      }),
    },
  },
};
