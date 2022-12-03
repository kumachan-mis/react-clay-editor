import styled from '@emotion/styled';
import React from 'react';

export type TextFieldHeaderProps = {
  header: string;
  size?: 'normal' | 'larger' | 'largest';
};

export const TextFieldHeaderConstants = {
  selectId: 'text-field-header',
  selectIdRegex: /text-field-header/,
  testId: 'text-field-header',
};

export const TextFieldHeader: React.FC<TextFieldHeaderProps> = ({ size = 'largest', header }) => (
  <StyledTextFieldHeader size={size} data-selectid={TextFieldHeaderConstants.selectId}>
    {header}
  </StyledTextFieldHeader>
);

const StyledTextFieldHeader = styled.div<{
  size: 'normal' | 'larger' | 'largest';
}>(
  (props) => `
  cursor: initial;
  padding-bottom: 5px;
  font-weight: bold;
  font-size: ${{ largest: '24px', larger: '20px', normal: '16px' }[props.size]};
`
);
