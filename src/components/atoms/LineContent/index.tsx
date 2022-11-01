import styled from '@emotion/styled';
import React from 'react';

import { Char } from '../Char';

export type LineContentProps = {
  lineIndex: number;
  lineLength: number;
  indentDepth?: number;
} & React.ComponentProps<'div'>;

export const LineContent: React.FC<LineContentProps> = ({
  lineIndex,
  lineLength,
  indentDepth = 0,
  children,
  ...rest
}) => {
  return (
    <StyledLineContent indentDepth={indentDepth} {...rest}>
      {children}
      <Char lineIndex={lineIndex} charIndex={lineLength}>
        {' '}
      </Char>
    </StyledLineContent>
  );
};

const StyledLineContent = styled.div<{
  indentDepth: number;
}>(
  (props) => `
  margin-left: ${1.5 * props.indentDepth}em;
`
);
