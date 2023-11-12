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
  font-size: ${props.theme[props.size].fontSize};
  line-height: ${props.theme[props.size].lineHeight};
  font-weight: bold;
  cursor: initial;
`
);
