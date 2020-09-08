import { TextSelection } from "../Selection/types";

export interface CursorCoordinate {
  lineIndex: number;
  charIndex: number;
}

export interface Props {
  coordinate: CursorCoordinate | undefined;
  textSelection: TextSelection | undefined;
  textAreaValue: string;
  isComposing: boolean;
  onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onTextChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onTextCompositionStart: (event: React.CompositionEvent<HTMLTextAreaElement>) => void;
  onTextCompositionEnd: (event: React.CompositionEvent<HTMLTextAreaElement>) => void;
}

export interface State {
  position: [number, number];
  cursorSize: number;
}
