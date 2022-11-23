export type CursorCoordinate = {
  lineIndex: number;
  charIndex: number;
};

export type CursorProps = {
  cursorCoordinate: CursorCoordinate | undefined;
  cursorScroll: 'none' | 'fired' | 'pause' | 'up' | 'down';
  textAreaValue: string;
  suggestionType: 'text' | 'bracketLink' | 'hashtag' | 'taggedLink' | 'none';
  suggestions: string[];
  suggestionIndex: number;
  onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onTextChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onTextCompositionStart: (event: React.CompositionEvent<HTMLTextAreaElement>) => void;
  onTextCompositionEnd: (event: React.CompositionEvent<HTMLTextAreaElement>) => void;
  onTextCut: (event: React.ClipboardEvent<HTMLTextAreaElement>) => void;
  onTextCopy: (event: React.ClipboardEvent<HTMLTextAreaElement>) => void;
  onTextPaste: (event: React.ClipboardEvent<HTMLTextAreaElement>) => void;
  onSuggectionMouseDown: (event: React.MouseEvent<HTMLLIElement>) => void;
};

export type CursorState = {
  position: { top: number; left: number };
  cursorSize: number;
};
