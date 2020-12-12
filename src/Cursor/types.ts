export interface CursorCoordinate {
  lineIndex: number;
  charIndex: number;
}

export interface SuggestionListDecoration {
  width: number;
  maxHeight: number;
  fontSize: number;
}

export interface Props {
  coordinate: CursorCoordinate | undefined;
  textAreaValue: string;
  suggestionType: 'bracketLink' | 'hashTag' | 'taggedLink' | 'none';
  suggestions: string[];
  suggestionIndex: number;
  suggestionListDecoration?: SuggestionListDecoration;
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

export interface CursorBarProps {
  position: Position;
  cursorSize: number;
}

export interface HiddenTextAreaProps {
  textAreaValue: string;
  position: Position;
  cursorSize: number;
  onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onTextChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onTextCut: (event: React.ClipboardEvent<HTMLTextAreaElement>) => void;
  onTextCopy: (event: React.ClipboardEvent<HTMLTextAreaElement>) => void;
  onTextPaste: (event: React.ClipboardEvent<HTMLTextAreaElement>) => void;
  onTextCompositionStart: (event: React.CompositionEvent<HTMLTextAreaElement>) => void;
  onTextCompositionEnd: (event: React.CompositionEvent<HTMLTextAreaElement>) => void;
}

export interface SuggestionListProps {
  suggestionType: 'bracketLink' | 'hashTag' | 'taggedLink' | 'none';
  suggestions: string[];
  suggestionIndex: number;
  suggestionListDecoration?: SuggestionListDecoration;
  position: Position;
  cursorSize: number;
  onSuggectionMouseDown: (event: React.MouseEvent<HTMLLIElement>) => void;
}
