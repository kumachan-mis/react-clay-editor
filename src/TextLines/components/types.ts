export interface HeaderProps {
  size?: 'normal' | 'larger' | 'largest';
}

export type LineGroupProps = {
  firstLineIndex: number;
  lastLineIndex: number;
} & React.ComponentProps<'div'>;

export type LineGroupIndentProps = {
  indentDepth: number;
} & React.ComponentProps<'span'>;

export type LineGroupContentProps = {
  indentDepth: number;
} & React.ComponentProps<'span'>;

export type LineProps = {
  lineIndex: number;
} & React.ComponentProps<'div'>;

export type LineIndentProps = {
  lineIndex: number;
  indentDepth: number;
} & React.ComponentProps<'span'>;

export type LineContentProps = {
  lineIndex: number;
  lineLength: number;
  indentDepth?: number;
  itemized?: boolean;
} & React.ComponentProps<'span'>;

export type CharGroupProps = {
  lineIndex: number;
  firstCharIndex: number;
  lastCharIndex: number;
} & React.ComponentProps<'span'>;

export type CharProps = {
  lineIndex: number;
  charIndex: number;
} & React.ComponentProps<'span'>;

export type ItemBulletProps = {
  lineIndex: number;
  indentDepth: number;
  bullet: string;
};

export type ItemBulletContentProps = {
  lineIndex: number;
  indentDepth: number;
  bullet: string;
  cursorOn: boolean;
};

export type EmbededLinkProps = {
  cursorOn: boolean;
  forceActive: boolean;
  anchorProps: (active: boolean) => React.ComponentProps<'a'> | undefined;
};
