import styled from '@emotion/styled';

export type LineGroupContentProps = {
  readonly indentDepth: number;
} & React.PropsWithoutRef<React.ComponentProps<'div'>>;

export const LineGroupContent: React.FC<LineGroupContentProps> = ({ indentDepth, ...rest }) => (
  <StyledLineGroupContent indentDepth={indentDepth} {...rest} />
);

const StyledLineGroupContent = styled.div<{
  indentDepth: number;
}>(
  (props) => `
  margin-left: ${1.5 * props.indentDepth}em;
`
);