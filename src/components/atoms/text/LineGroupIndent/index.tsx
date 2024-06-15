import styled from '@emotion/styled';
import React from 'react';

export type LineGroupIndentProps = {
  readonly indentDepth: number;
} & React.PropsWithoutRef<React.ComponentProps<'span'>>;

const StyledLineGroupIndent = styled.span<{
  indentDepth: number;
}>(
  (props) => `
  left: 0;
  top: 0;
  position: absolute;
  width: ${1.5 * props.indentDepth}em;
`
);

const StyledLineGroupIndentPad = styled.span`
  display: inline-block;
  width: 1.5em;
  overflow: hidden;
`;

const LineGroupIndentComponent: React.FC<LineGroupIndentProps> = ({ indentDepth, children, ...rest }) => (
  <StyledLineGroupIndent indentDepth={indentDepth} {...rest}>
    {[...Array(indentDepth).keys()].map((charIndex) => (
      <StyledLineGroupIndentPad key={charIndex}> </StyledLineGroupIndentPad>
    ))}
    {children}
  </StyledLineGroupIndent>
);

export const LineGroupIndent = React.memo(LineGroupIndentComponent);
