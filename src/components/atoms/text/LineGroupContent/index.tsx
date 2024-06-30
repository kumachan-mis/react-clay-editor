import styled from '@emotion/styled';
import React from 'react';

export type LineGroupContentProps = {
  readonly indentDepth: number;
} & React.PropsWithoutRef<React.ComponentProps<'div'>>;

const StyledLineGroupContent = styled.div<{
  indentDepth: number;
}>(
  (props) => `
  margin-left: ${1.5 * props.indentDepth}em;
`
);

const LineGroupContentComponent: React.FC<LineGroupContentProps> = ({ indentDepth, ...rest }) => (
  <StyledLineGroupContent indentDepth={indentDepth} {...rest} />
);

export const LineGroupContent = React.memo(LineGroupContentComponent);
