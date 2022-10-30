import styled from '@emotion/styled';
import React from 'react';

import { createTestId } from '../../../common/utils';

export type CharGroupProps = {
  lineIndex: number;
  firstCharIndex: number;
  lastCharIndex: number;
} & React.ComponentProps<'span'>;

export const CharGroupConstants = {
  selectId: (lineIndex: number, first: number, last: number): string => `chargroup-L${lineIndex}C${first}-${last}`,
  selectIdRegex: RegExp('chargroup-L(?<lineIndex>\\d+)C(?<first>\\d+)-(?<last>\\d+)'),
  testId: (lineIndex: number, first: number, last: number): string => `chargroup-L${lineIndex}C${first}-${last}`,
};

export const CharGroup: React.FC<CharGroupProps> = ({ lineIndex, firstCharIndex, lastCharIndex, ...rest }) => (
  <StyledCharGroup
    {...rest}
    data-selectid={CharGroupConstants.selectId(lineIndex, firstCharIndex, lastCharIndex)}
    data-testid={createTestId(CharGroupConstants.testId(lineIndex, firstCharIndex, lastCharIndex))}
  />
);

const StyledCharGroup = styled.span`
  display: inline-block;
`;
