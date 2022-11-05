import styled from '@emotion/styled';
import React, { PropsWithChildren } from 'react';

import { createTestId } from '../../../../common/utils';

export type TextFieldRootProps = PropsWithChildren<{ hideMenu?: boolean }>;

export const TextFieldRootConstants = {
  selectId: 'text-field-root',
  selectIdRegex: /text-field-root/,
  testId: 'text-field-root',
};

export const TextFieldRoot: React.FC<TextFieldRootProps> = ({ hideMenu, children }) => (
  <StyledTextFieldRoot
    hideMenu={hideMenu}
    data-selectid={TextFieldRootConstants.selectId}
    data-testid={createTestId(TextFieldRootConstants.testId)}
  >
    {children}
  </StyledTextFieldRoot>
);

const StyledTextFieldRoot = styled.div<{ hideMenu?: boolean }>(
  (props) => `
  width: 100%;
  height: ${props.hideMenu ? '100%' : 'calc(100% - 36px)'};
  overflow-y: scroll;
  position: relative;
  user-select: none;
`
);
