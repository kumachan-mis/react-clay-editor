import { Char } from '../Char';

import styled from '@emotion/styled';
import React from 'react';

export type LineContentProps = {
  readonly lineLength: number;
  readonly indentDepth?: number;
} & React.PropsWithoutRef<React.ComponentProps<'div'>>;

const StyledLineContent = styled.div<{
  indentDepth: number;
}>(
  (props) => `
  margin-left: ${1.5 * props.indentDepth}em;
`,
);

const LineContentComponent: React.FC<LineContentProps> = ({ lineLength, indentDepth = 0, children, ...rest }) => {
  return (
    <StyledLineContent indentDepth={indentDepth} {...rest}>
      {children}
      <Char charIndex={lineLength}> </Char>
    </StyledLineContent>
  );
};

export const LineContent = React.memo(LineContentComponent);
