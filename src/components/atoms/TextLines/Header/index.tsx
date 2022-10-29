import styled from '@emotion/styled';
import React from 'react';

import { createTestId } from '../../../../common/utils';

export type HeaderProps = React.PropsWithChildren<{
  size?: 'normal' | 'larger' | 'largest';
}>;

export const HeaderConstants = {
  selectId: 'header',
  selectIdRegex: /header/,
  testId: 'header',
};

export const Header: React.FC<HeaderProps> = ({ size = 'largest', children }) => (
  <StyledHeader size={size} data-selectid={HeaderConstants.selectId} data-testid={createTestId(HeaderConstants.testId)}>
    {children}
  </StyledHeader>
);

const StyledHeader = styled.div<{
  size: 'normal' | 'larger' | 'largest';
}>(
  (props) => `
  cursor: initial;
  padding-bottom: 5px;
  font-weight: bold;
  font-size: ${{ largest: '24px', larger: '20px', normal: '16px' }[props.size]};
`
);
