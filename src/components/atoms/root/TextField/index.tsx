import styled from '@emotion/styled';
import React from 'react';

import { createTestId } from '../../../../common/utils';

export type TextFieldProps = React.PropsWithoutRef<React.ComponentProps<'div'>>;

export const TextFieldConstants = {
  selectId: 'text-field',
  selectIdRegex: /text-field/,
  testId: 'text-field',
};

const ForwardRefTextField: React.ForwardRefRenderFunction<HTMLDivElement, TextFieldProps> = ({ ...rest }, ref) => (
  <StyledForwardRefTextField
    {...rest}
    ref={ref}
    data-selectid={TextFieldConstants.selectId}
    data-testid={createTestId(TextFieldConstants.testId)}
  />
);

const StyledForwardRefTextField = styled.div`
  width: 100%;
  height: auto;
  min-height: 100%;
  cursor: text;
  white-space: pre-wrap;
  word-wrap: break-word;
`;

export const TextField = React.forwardRef(ForwardRefTextField);
