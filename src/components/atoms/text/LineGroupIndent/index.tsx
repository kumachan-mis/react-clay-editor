import styled from '@emotion/styled';
import React from 'react';

export type LineGroupIndentProps = {
  indentDepth: number;
} & React.ComponentProps<'span'>;

export const LineGroupIndent: React.FC<LineGroupIndentProps> = ({ indentDepth, children, ...rest }) => (
  <StyledLineGroupIndent indentDepth={indentDepth} {...rest}>
    {[...Array(indentDepth).keys()].map((charIndex) => (
      <StyledLineGroupIndentPad key={charIndex}> </StyledLineGroupIndentPad>
    ))}
    {children}
  </StyledLineGroupIndent>
);

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
