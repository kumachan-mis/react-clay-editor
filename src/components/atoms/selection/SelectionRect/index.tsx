import styled from '@emotion/styled';
import React from 'react';

import { createTestId } from '../../../../common/utils';

export type SelectionRectProps = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export const selectionRectConstants = {
  selectId: 'selection',
  testId: 'selection',
};

export const SelectionRect: React.FC<SelectionRectProps> = ({ top, left, width, height }) => (
  <StyledSelectionRect
    top={top}
    left={left}
    width={width}
    height={height}
    data-selectid={selectionRectConstants.selectId}
    data-testid={createTestId(selectionRectConstants.testId)}
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
  background-color: #accef7;
  opacity: 0.5;
  top: ${props.top}px;
  left: ${props.left}px;
  width: ${props.width}px;
  height: ${props.height}px;
`
);
