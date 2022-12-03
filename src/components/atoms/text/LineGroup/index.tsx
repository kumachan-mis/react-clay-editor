import styled from '@emotion/styled';
import React from 'react';

export type LineGroupProps = {
  firstLineIndex: number;
  lastLineIndex: number;
} & React.PropsWithoutRef<React.ComponentProps<'div'>>;

export const LineGroupConstants = {
  selectId: (first: number, last: number): string => `linegroup-L${first}-${last}`,
  selectIdRegex: RegExp('linegroup-L(?<first>\\d+)-(?<last>\\d+)'),
};

export const LineGroup: React.FC<LineGroupProps> = ({ firstLineIndex, lastLineIndex, ...rest }) => (
  <StyledLineGroup {...rest} data-selectid={LineGroupConstants.selectId(firstLineIndex, lastLineIndex)} />
);

const StyledLineGroup = styled.div`
  position: relative;
`;
