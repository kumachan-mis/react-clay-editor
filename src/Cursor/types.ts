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
  onTextCut: (event: React.ClipboardEvent<HTMLTextAreaElement>) => void;
  onTextCopy: (event: React.ClipboardEvent<HTMLTextAreaElement>) => void;
  onTextPaste: (event: React.ClipboardEvent<HTMLTextAreaElement>) => void;
  onTextCompositionStart: (event: React.CompositionEvent<HTMLTextAreaElement>) => void;
  onTextCompositionEnd: (event: React.CompositionEvent<HTMLTextAreaElement>) => void;
}

export interface Position {
  top: number;
  left: number;
}

export interface State {
  position: Position;
  cursorSize: number;
}