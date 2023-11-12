import styled from '@emotion/styled';
import React from 'react';

export type SuggestionListProps = {
  position: { top: number; left: number };
  cursorSize: number;
} & React.PropsWithoutRef<React.ComponentProps<'div'>>;

export const SuggestionList: React.FC<SuggestionListProps> = ({ position, cursorSize, ...rest }) => (
  <StyledSuggestionList position={position} cursorSize={cursorSize} {...rest} />
);

const StyledSuggestionList = styled.div<{
  position: { top: number; left: number };
  cursorSize: number;
}>(
  (props) => `
  position: absolute;
  min-width: 250px;
  border-radius: 8px;
  border: 1px solid ${props.theme.list.borderColor};
  box-shadow: 0px 4px 8px ${props.theme.list.shadowColor};
  background-color: ${props.theme.list.backgroundColor};
  z-index: 1;
  top: ${props.position.top + props.cursorSize + 2}px;
  left: ${props.position.left}px;
`
);
