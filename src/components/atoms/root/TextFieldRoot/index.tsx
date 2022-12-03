import styled from '@emotion/styled';
import React from 'react';

import { createTestId } from '../../../../common/utils';

export type TextFieldRootProps = React.PropsWithChildren;

export const TextFieldRootConstants = {
  selectId: 'text-field-root',
  selectIdRegex: /text-field-root/,
  testId: 'text-field-root',
};

export const TextFieldRoot: React.FC<TextFieldRootProps> = ({ children }) => (
  <StyledTextFieldRoot
    data-selectid={TextFieldRootConstants.selectId}
    data-testid={createTestId(TextFieldRootConstants.testId)}
  >
    {children}
  </StyledTextFieldRoot>
);

const StyledTextFieldRoot = styled.div`
  width: 100%;
  height: calc(100% - 36px);
  flex-grow: 1;
  overflow-y: scroll;
  position: relative;
  user-select: none;
`;
