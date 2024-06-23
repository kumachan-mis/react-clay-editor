import { Char } from '../Char';

import styled from '@emotion/styled';
import React from 'react';

export type LineIndentProps = {
  readonly indentDepth: number;
} & React.PropsWithoutRef<React.ComponentProps<'span'>>;

const StyledLineIndent = styled.span<{
  indentDepth: number;
}>(
  (props) => `
  left: 0;
  top: 0;
  position: absolute;
  width: ${1.5 * props.indentDepth}em;
`
);

const StyledLineIndentPad = styled(Char)`
  display: inline-block;
  width: 1.5em;
  overflow: hidden;
`;

const LineIndentComponent: React.FC<LineIndentProps> = ({ indentDepth, ...rest }) => (
  <StyledLineIndent indentDepth={indentDepth} {...rest}>
    {[...Array(indentDepth).keys()].map((charIndex) => (
      <StyledLineIndentPad charIndex={charIndex} key={charIndex}>
        {' '}
      </StyledLineIndentPad>
    ))}
  </StyledLineIndent>
);

export const LineIndent = React.memo(LineIndentComponent);
