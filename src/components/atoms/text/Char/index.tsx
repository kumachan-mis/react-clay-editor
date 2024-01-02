export type CharProps = {
  readonly lineIndex: number;
  readonly charIndex: number;
} & React.PropsWithoutRef<React.ComponentProps<'span'>>;

export const CharConstants = {
  selectId: (lineIndex: number, charIndex: number): string => `char-L${lineIndex}C${charIndex}`,
  selectIdRegex: RegExp('char-L(?<lineIndex>\\d+)C(?<charIndex>\\d+)'),
};

export const Char: React.FC<CharProps> = ({ lineIndex, charIndex, ...rest }) => (
  <span {...rest} data-selectid={CharConstants.selectId(lineIndex, charIndex)} />
);
