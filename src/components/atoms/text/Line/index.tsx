import styled from '@emotion/styled';
import React from 'react';

export type LineProps = {
  readonly lineIndex: number;
  readonly children?: React.ReactNode;
};

export const LineConstants = {
  selectId: (lineIndex: number): string => `line-L${lineIndex}`,
  selectIdRegex: RegExp('line-L(?<lineIndex>\\d+)'),
};

const StyledLine = styled.div`
  position: relative;
`;

const LineComponent: React.FC<LineProps> = ({ lineIndex, ...rest }) => (
  <StyledLine {...rest} data-selectid={LineConstants.selectId(lineIndex)} />
);

export const Line = React.memo(LineComponent);
