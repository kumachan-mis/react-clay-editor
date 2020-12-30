export interface LineGroupProps {
  fromLineIndex: number;
  toLineIndex: number;
  divPorps?: React.ComponentProps<'div'>;
}

export interface LineGroupIndentProps {
  indentDepth: number;
  spanPorps?: React.ComponentProps<'span'>;
}

export interface LineGroupContentProps {
  indentDepth: number;
  spanPorps?: React.ComponentProps<'span'>;
}

export interface LineProps {
  lineIndex: number;
  defaultFontSize: number;
  divPorps?: React.ComponentProps<'div'>;
}

export interface LineIndentProps {
  lineIndex: number;
  indentDepth: number;
  spanPorps?: React.ComponentProps<'span'>;
}

export interface LineContentProps {
  lineIndex: number;
  indentDepth: number;
  contentLength?: number;
  spanPorps?: React.ComponentProps<'span'>;
}

export interface CharGroupProps {
  lineIndex: number;
  fromCharIndex: number;
  toCharIndex: number;
  spanPorps?: React.ComponentProps<'span'>;
}

export interface CharProps {
  lineIndex: number;
  charIndex: number;
  spanPorps?: React.ComponentProps<'span'>;
}

export type AnchorWithHoverStyleProps = React.ComponentProps<'a'> & {
  overriddenStyleOnHover?: React.CSSProperties;
  cursorOn: boolean;
};
