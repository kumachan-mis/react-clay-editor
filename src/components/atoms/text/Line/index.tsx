import styled from '@emotion/styled';
import React from 'react';

export type LineProps = {
  lineIndex: number;
} & React.PropsWithoutRef<React.ComponentProps<'div'>>;

export const LineConstants = {
  selectId: (lineIndex: number): string => `line-L${lineIndex}`,
  selectIdRegex: RegExp('line-L(?<lineIndex>\\d+)'),
  testId: (lineIndex: number): string => `line-L${lineIndex}`,
};

export const Line: React.FC<LineProps> = ({ lineIndex, ...rest }) => (
  <StyledLine {...rest} data-selectid={LineConstants.selectId(lineIndex)} />
);

const StyledLine = styled.div`
  position: relative;
`;
