import styled from '@emotion/styled';
import React from 'react';

import { Char } from '../Char';

export type LineContentProps = {
  lineIndex: number;
  lineLength: number;
  indentDepth?: number;
  itemized?: boolean;
} & React.ComponentProps<'span'>;

export const LineContent: React.FC<LineContentProps> = ({
  lineIndex,
  lineLength,
  indentDepth = 0,
  itemized = false,
  children,
  ...rest
}) => {
  return (
    <StyledLineContent indentDepth={indentDepth} itemized={itemized} {...rest}>
      {children}
      <Char lineIndex={lineIndex} charIndex={lineLength}>
        {' '}
      </Char>
    </StyledLineContent>
  );
};

const StyledLineContent = styled.span<{
  indentDepth: number;
  itemized: boolean;
}>(
  (props) => `
  display: block;
  margin-left: ${1.5 * (props.itemized ? props.indentDepth + 1 : props.indentDepth)}em;
`
);
