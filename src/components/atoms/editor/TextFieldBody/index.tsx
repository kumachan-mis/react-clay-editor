import styled from '@emotion/styled';
import React from 'react';

import { createTestId } from '../../../../common/utils';

export type TextFieldBodyProps = React.PropsWithoutRef<React.ComponentProps<'div'>>;

export const TextFieldBodyConstants = {
  selectId: 'text-field-body',
  selectIdRegex: /text-field-body/,
  testId: 'text-field-body',
};

const ForwardRefTextFieldBody: React.ForwardRefRenderFunction<HTMLDivElement, TextFieldBodyProps> = (
  { ...rest },
  ref
) => (
  <StyledForwardRefTextFieldBody
    {...rest}
    ref={ref}
    data-selectid={TextFieldBodyConstants.selectId}
    data-testid={createTestId(TextFieldBodyConstants.testId)}
  />
);

const StyledForwardRefTextFieldBody = styled.div`
  width: 100%;
  height: auto;
  min-height: 100%;
  cursor: text;
  white-space: pre-wrap;
  word-wrap: break-word;
`;

export const TextFieldBody = React.forwardRef(ForwardRefTextFieldBody);
