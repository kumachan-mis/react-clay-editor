export interface CursorCoordinate {
  lineIndex: number;
  charIndex: number;
}

export const enum SuggestionType {
  BracketLink,
  HashTag,
  TaggedLink,
  None,
}

export interface SuggestionListDecoration {
  width: number;
  maxHeight: number;
  fontSize: number;
}

export interface Props {
  coordinate: CursorCoordinate | undefined;
  textAreaValue: string;
  suggestionType: SuggestionType;
  suggestions: string[];
  suggestionIndex: number;
  suggestionListDecoration: SuggestionListDecoration;
  onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onTextChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onTextCut: (event: React.ClipboardEvent<HTMLTextAreaElement>) => void;
  onTextCopy: (event: React.ClipboardEvent<HTMLTextAreaElement>) => void;
  onTextPaste: (event: React.ClipboardEvent<HTMLTextAreaElement>) => void;
  onTextCompositionStart: (event: React.CompositionEvent<HTMLTextAreaElement>) => void;
  onTextCompositionEnd: (event: React.CompositionEvent<HTMLTextAreaElement>) => void;
  onSuggectionMouseDown: (event: React.MouseEvent<HTMLLIElement>) => void;
}

export interface Position {
  top: number;
  left: number;
}

export interface State {
  position: Position;
  cursorSize: number;
}
