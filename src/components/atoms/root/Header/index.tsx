import { FONT_SIZES, LINE_HEIGHTS } from '../../../../common/constants';

import styled from '@emotion/styled';
import React from 'react';

export type HeaderProps = {
  header: string;
  size?: 'normal' | 'larger' | 'largest';
};

export const HeaderConstants = {
  selectId: 'header',
  selectIdRegex: /header/,
};

export const Header: React.FC<HeaderProps> = ({ size = 'largest', header }) => (
  <StyledHeader size={size} data-selectid={HeaderConstants.selectId}>
    {header}
  </StyledHeader>
);

const StyledHeader = styled.div<{
  size: 'normal' | 'larger' | 'largest';
}>(
  (props) => `
  font-size: ${FONT_SIZES[props.size]};
  line-height: ${LINE_HEIGHTS[props.size]};
  font-weight: bold;
  cursor: initial;
`
);
