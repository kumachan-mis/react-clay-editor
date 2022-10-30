import styled from '@emotion/styled';
import React from 'react';

export type LineGroupContentProps = {
  indentDepth: number;
} & React.ComponentProps<'span'>;

export const LineGroupContent: React.FC<LineGroupContentProps> = ({ indentDepth, ...rest }) => (
  <StyledLineGroupContent indentDepth={indentDepth} {...rest} />
);

const StyledLineGroupContent = styled.span<{
  indentDepth: number;
}>(
  (props) => `
  display: block;
  margin-left: ${1.5 * props.indentDepth}em;
`
);
