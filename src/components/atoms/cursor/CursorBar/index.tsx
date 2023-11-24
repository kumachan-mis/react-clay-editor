import styled from '@emotion/styled';
import React from 'react';

export type CursorBarProps = {
  readonly position: { top: number; left: number };
  readonly cursorSize: number;
};

export const CursorBar: React.FC<CursorBarProps> = (props) => (
  <StyledCursorBar {...props}>
    <svg height={props.cursorSize} width="2px">
      <CursorBarRect height="100%" width="1px" x={0} y={0} />
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

export const CursorBarRect = styled.rect(
  (props) => `
  fill: ${props.theme.base.cursorColor};`
);
