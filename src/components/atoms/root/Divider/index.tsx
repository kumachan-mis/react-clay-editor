import styled from '@emotion/styled';
import React from 'react';

export const DividerConstants = {
  selectId: 'divider',
  selectIdRegex: /divider/,
};

export const Divider: React.FC = () => <StyledDivider data-selectid={DividerConstants.selectId} />;

const StyledDivider = styled.div`
  width: 100%;
  border-bottom: solid 1px rgba(0, 0, 0, 0.2);
`;
