import styled from '@emotion/styled';
import React from 'react';

export type TextFieldRootProps = React.PropsWithChildren;

export const TextFieldRootConstants = {
  selectId: 'text-field-root',
  selectIdRegex: /text-field-root/,
};

export const TextFieldRoot: React.FC<TextFieldRootProps> = ({ children }) => (
  <StyledTextFieldRoot data-selectid={TextFieldRootConstants.selectId}>{children}</StyledTextFieldRoot>
);

const StyledTextFieldRoot = styled.div`
  width: 100%;
  flex-grow: 1;
  overflow-y: scroll;
  position: relative;
  user-select: none;
`;
