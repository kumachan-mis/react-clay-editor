export interface LineGroupProps {
  firstLineIndex: number;
  lastLineIndex: number;
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
  lineLength: number;
  indentDepth?: number;
  itemized?: boolean;
  spanProps?: React.ComponentProps<'span'>;
}

export interface CharGroupProps {
  lineIndex: number;
  firstCharIndex: number;
  lastCharIndex: number;
  spanProps?: React.ComponentProps<'span'>;
}

export interface CharProps {
  lineIndex: number;
  charIndex: number;
  spanProps?: React.ComponentProps<'span'>;
}

export interface ItemBulletProps {
  lineIndex: number;
  indentDepth: number;
  bullet: string;
}

export interface ItemBulletContentProps {
  lineIndex: number;
  indentDepth: number;
  bullet: string;
  cursorOn: boolean;
}

export interface EmbededLinkProps {
  cursorOn: boolean;
  anchorProps?: React.ComponentProps<'a'>;
}
