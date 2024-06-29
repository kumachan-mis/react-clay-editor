import styled from '@emotion/styled';
import React from 'react';

export type LineProps = {
  readonly lineId: string;
  readonly children?: React.ReactNode;
};

export const LineConstants = {
  selectId: (lineId: string): string => `line-L${lineId}`,
  selectIdRegex: RegExp('line-L(?<lineId>[0-9a-z]+)'),
};

const StyledLine = styled.div`
  position: relative;
`;

const LineComponent: React.FC<LineProps> = ({ lineId, ...rest }) => (
  <StyledLine {...rest} data-selectid={LineConstants.selectId(lineId)} />
);

export const Line = React.memo(LineComponent);
