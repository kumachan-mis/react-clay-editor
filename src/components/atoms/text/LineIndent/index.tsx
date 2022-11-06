import styled from '@emotion/styled';
import React from 'react';

import { Char } from '../Char';

export type LineIndentProps = {
  lineIndex: number;
  indentDepth: number;
} & React.PropsWithoutRef<React.ComponentProps<'span'>>;

export const LineIndent: React.FC<LineIndentProps> = ({ lineIndex, indentDepth, ...rest }) => (
  <StyledLineIndent indentDepth={indentDepth} {...rest}>
    {[...Array(indentDepth).keys()].map((charIndex) => (
      <StyledLineIndentPad key={charIndex} charIndex={charIndex} lineIndex={lineIndex}>
        {' '}
      </StyledLineIndentPad>
    ))}
  </StyledLineIndent>
);

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
