import styled from '@emotion/styled';
import React from 'react';

export type CursorTextAreaProps = {
  position: { top: number; left: number };
  cursorSize: number;
} & React.ComponentProps<'textarea'>;

export const CursorTextArea: React.FC<CursorTextAreaProps> = ({ position, cursorSize, ...rest }) => (
  <StyledCursorTextArea
    position={position}
    cursorSize={cursorSize}
    wrap="off"
    spellCheck={false}
    autoCapitalize="none"
    {...rest}
  />
);

const StyledCursorTextArea = styled.textarea<{
  position: { top: number; left: number };
  cursorSize: number;
}>(
  (props) => `
  font-family: sans-serif;
  position: absolute;
  overflow: hidden;
  border: none;
  outline: none;
  resize: none;
  padding: 0px;
  z-index: 1;
  top: ${props.position.top}px;
  left: ${props.position.left}px;
  width: ${Math.min(length, 10) * props.cursorSize}px;
  height: ${props.cursorSize}px;
  min-height: ${props.cursorSize}px;
  font-size: ${props.cursorSize}px;
`
);
