export interface CursorCoordinate {
  lineIndex: number;
  charIndex: number;
}

export interface Props {
  coordinate: CursorCoordinate | undefined;
  textAreaValue: string;
  isComposing: boolean;
  onKeyDown: (key: string) => void;
  onTextChange: (value: string) => void;
  onTextCompositionStart: () => void;
  onTextCompositionEnd: () => void;
}

export interface State {
  position: [number, number];
  cursorSize: number;
}
