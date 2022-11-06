import styled from '@emotion/styled';
import React from 'react';

export type CursorBarProps = {
  position: { top: number; left: number };
  cursorSize: number;
};

export const CursorBar: React.FC<CursorBarProps> = (props) => (
  <StyledCursorBar {...props}>
    <svg width="2px" height={props.cursorSize}>
      <rect x={0} y={0} width="1px" height="100%" />
    </svg>
  </StyledCursorBar>
);

const StyledCursorBar = styled.div<{
  position: { top: number; left: number };
  cursorSize: number;
}>(
  (props) => `
  position: absolute;
  top: ${props.position.top}px;
  left: ${props.position.left}px;
  height: ${props.cursorSize}px;
`
);
