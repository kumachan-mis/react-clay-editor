export interface LineGroupProps {
  fromLineIndex: number;
  toLineIndex: number;
  divProps?: React.ComponentProps<'div'>;
}

export interface LineGroupIndentProps {
  indentDepth: number;
  spanProps?: React.ComponentProps<'span'>;
}

export interface LineGroupContentProps {
  indentDepth: number;
  spanProps?: React.ComponentProps<'span'>;
}

export interface LineProps {
  lineIndex: number;
  divProps?: React.ComponentProps<'div'>;
}

export interface LineIndentProps {
  lineIndex: number;
  indentDepth: number;
  spanProps?: React.ComponentProps<'span'>;
}

export interface LineContentProps {
  lineIndex: number;
  indentDepth: number;
  contentLength?: number;
  spanProps?: React.ComponentProps<'span'>;
}

export interface CharGroupProps {
  lineIndex: number;
  fromCharIndex: number;
  toCharIndex: number;
  spanProps?: React.ComponentProps<'span'>;
}

export interface CharProps {
  lineIndex: number;
  charIndex: number;
  spanProps?: React.ComponentProps<'span'>;
}
