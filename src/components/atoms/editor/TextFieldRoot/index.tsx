import styled from '@emotion/styled';
import React, { PropsWithChildren } from 'react';

import { createTestId } from '../../../../common/utils';

export type TextFieldRootProps = PropsWithChildren<{ hideSyntaxMenu?: boolean }>;

export const TextFieldRootConstants = {
  selectId: 'text-field-root',
  selectIdRegex: /text-field-root/,
  testId: 'text-field-root',
};

export const TextFieldRoot: React.FC<TextFieldRootProps> = ({ hideSyntaxMenu, children }) => (
  <StyledTextFieldRoot
    hideSyntaxMenu={hideSyntaxMenu}
    data-selectid={TextFieldRootConstants.selectId}
    data-testid={createTestId(TextFieldRootConstants.testId)}
  >
    {children}
  </StyledTextFieldRoot>
);

const StyledTextFieldRoot = styled.div<{ hideSyntaxMenu?: boolean }>(
  (props) => `
  width: 100%;
  height: ${props.hideSyntaxMenu ? '100%' : 'calc(100% - 36px)'};
  overflow-y: scroll;
  position: relative;
  user-select: none;
`
);
