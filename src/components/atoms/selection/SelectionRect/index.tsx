import styled from '@emotion/styled';
import React from 'react';

export type SelectionRectProps = {
  readonly top: number;
  readonly left: number;
  readonly width: number;
  readonly height: number;
};

export const SelectionRectConstants = {
  selectId: 'selection',
};

export const SelectionRect: React.FC<SelectionRectProps> = ({ top, left, width, height }) => (
  <StyledSelectionRect
    data-selectid={SelectionRectConstants.selectId}
    height={height}
    left={left}
    top={top}
    width={width}
  />
);

const StyledSelectionRect = styled.div<{
  top: number;
  left: number;
  width: number;
  height: number;
}>(
  (props) => `
  position: absolute;
  background-color: ${props.theme.base.selectionColor};
  top: ${props.top}px;
  left: ${props.left}px;
  width: ${props.width}px;
  height: ${props.height}px;
`
);
