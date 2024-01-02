import styled from '@emotion/styled';

export type LineGroupProps = {
  readonly firstLineIndex: number;
  readonly lastLineIndex: number;
} & React.PropsWithoutRef<React.ComponentProps<'div'>>;

export const LineGroupConstants = {
  selectId: (first: number, last: number): string => `linegroup-L${first}-${last}`,
  selectIdRegex: RegExp('linegroup-L(?<first>\\d+)-(?<last>\\d+)'),
};

export const LineGroup: React.FC<LineGroupProps> = ({ firstLineIndex, lastLineIndex, ...rest }) => (
  <StyledLineGroup {...rest} data-selectid={LineGroupConstants.selectId(firstLineIndex, lastLineIndex)} />
);

const StyledLineGroup = styled.div`
  position: relative;
`;
