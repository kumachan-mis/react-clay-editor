import { FONT_SIZES, LINE_HEIGHTS } from 'src/common/constants';

import styled from '@emotion/styled';
import React from 'react';

export type TextFieldHeaderProps = {
  header: string;
  size?: 'normal' | 'larger' | 'largest';
};

export const TextFieldHeaderConstants = {
  selectId: 'text-field-header',
  selectIdRegex: /text-field-header/,
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
  font-size: ${FONT_SIZES[props.size]};
  line-height: ${LINE_HEIGHTS[props.size]};
  font-weight: bold;
  cursor: initial;
`
);
