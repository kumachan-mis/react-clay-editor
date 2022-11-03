import styled from '@emotion/styled';
import React from 'react';

import { createTestId } from '../../../../common/utils';

export type LineGroupProps = {
  firstLineIndex: number;
  lastLineIndex: number;
} & React.ComponentProps<'div'>;

export const LineGroupConstants = {
  selectId: (first: number, last: number): string => `linegroup-L${first}-${last}`,
  selectIdRegex: RegExp('linegroup-L(?<first>\\d+)-(?<last>\\d+)'),
  testId: (first: number, last: number): string => `linegroup-L${first}-${last}`,
};

export const LineGroup: React.FC<LineGroupProps> = ({ firstLineIndex, lastLineIndex, ...rest }) => (
  <StyledLineGroup
    {...rest}
    data-selectid={LineGroupConstants.selectId(firstLineIndex, lastLineIndex)}
    data-testid={createTestId(LineGroupConstants.testId(firstLineIndex, lastLineIndex))}
  />
);

const StyledLineGroup = styled.div`
  position: relative;
`;
