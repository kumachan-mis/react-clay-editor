import styled from '@emotion/styled';
import React from 'react';

import { createTestId } from '../../../../common/utils';

export type LineProps = {
  lineIndex: number;
} & React.ComponentProps<'div'>;

export const LineConstants = {
  selectId: (lineIndex: number): string => `line-L${lineIndex}`,
  selectIdRegex: RegExp('line-L(?<lineIndex>\\d+)'),
  testId: (lineIndex: number): string => `line-L${lineIndex}`,
};

export const Line: React.FC<LineProps> = ({ lineIndex, ...rest }) => (
  <StyledLine
    {...rest}
    data-selectid={LineConstants.selectId(lineIndex)}
    data-testid={createTestId(LineConstants.testId(lineIndex))}
  />
);

const StyledLine = styled.div`
  display: block;
  position: relative;
`;
