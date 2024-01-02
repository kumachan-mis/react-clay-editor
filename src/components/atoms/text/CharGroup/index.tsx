import styled from '@emotion/styled';

export type CharGroupProps = {
  readonly lineIndex: number;
  readonly firstCharIndex: number;
  readonly lastCharIndex: number;
} & React.PropsWithoutRef<React.ComponentProps<'span'>>;

export const CharGroupConstants = {
  selectId: (lineIndex: number, first: number, last: number): string => `chargroup-L${lineIndex}C${first}-${last}`,
  selectIdRegex: RegExp('chargroup-L(?<lineIndex>\\d+)C(?<first>\\d+)-(?<last>\\d+)'),
};

export const CharGroup: React.FC<CharGroupProps> = ({ lineIndex, firstCharIndex, lastCharIndex, ...rest }) => (
  <StyledCharGroup {...rest} data-selectid={CharGroupConstants.selectId(lineIndex, firstCharIndex, lastCharIndex)} />
);

const StyledCharGroup = styled.span`
  display: inline-block;
`;
