import styled from '@emotion/styled';
import React from 'react';

import { createTestId } from '../../../../common/utils';

export type TextFieldBodyProps = React.PropsWithoutRef<React.ComponentProps<'div'>>;

export const TextFieldBodyConstants = {
  selectId: 'text-field-body',
  selectIdRegex: /text-field-body/,
  testId: 'text-field-body',
};

export const TextFieldBody: React.FC<TextFieldBodyProps> = ({ ...rest }) => (
  <StyledTextFieldBody
    {...rest}
    data-selectid={TextFieldBodyConstants.selectId}
    data-testid={createTestId(TextFieldBodyConstants.testId)}
  />
);

const StyledTextFieldBody = styled.div`
  width: 100%;
  height: auto;
  min-height: 100%;
  font-family: sans-serif;
  cursor: text;
  white-space: pre-wrap;
  word-wrap: break-word;
`;
