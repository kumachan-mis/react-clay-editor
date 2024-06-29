import styled from '@emotion/styled';
import React from 'react';

export type LineGroupProps = {
  readonly firstLineId: string;
  readonly lastLineId: string;
} & React.PropsWithoutRef<React.ComponentProps<'div'>>;

export const LineGroupConstants = {
  selectId: (first: string, last: string): string => `linegroup-L${first}-${last}`,
  selectIdRegex: RegExp('linegroup-L(?<first>[0-9a-z]+)-(?<last>[0-9a-z]+)'),
};

const StyledLineGroup = styled.div`
  position: relative;
`;

const LineGroupComponent: React.FC<LineGroupProps> = ({ firstLineId, lastLineId, ...rest }) => (
  <StyledLineGroup {...rest} data-selectid={LineGroupConstants.selectId(firstLineId, lastLineId)} />
);

export const LineGroup = React.memo(LineGroupComponent);
