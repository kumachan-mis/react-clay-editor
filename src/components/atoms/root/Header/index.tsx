import styled from '@emotion/styled';
import React from 'react';

export type HeaderProps = {
  readonly header: string;
  readonly size?: 'normal' | 'larger' | 'largest';
};

export const HeaderConstants = {
  selectId: 'header',
  selectIdRegex: /header/,
};

export const Header: React.FC<HeaderProps> = ({ size = 'largest', header }) => (
  <StyledHeader data-selectid={HeaderConstants.selectId} size={size}>
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
