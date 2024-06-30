import styled from '@emotion/styled';
import React from 'react';

export type CharGroupProps = {
  readonly firstCharIndex: number;
  readonly lastCharIndex: number;
} & React.PropsWithoutRef<React.ComponentProps<'span'>>;

export const CharGroupConstants = {
  selectId: (first: number, last: number): string => `chargroup-C${first}-${last}`,
  selectIdRegex: RegExp('chargroup-C(?<first>\\d+)-(?<last>\\d+)'),
};

const StyledCharGroup = styled.span`
  display: inline-block;
`;

const CharGroupComponent: React.FC<CharGroupProps> = ({ firstCharIndex, lastCharIndex, ...rest }) => (
  <StyledCharGroup {...rest} data-selectid={CharGroupConstants.selectId(firstCharIndex, lastCharIndex)} />
);

export const CharGroup = React.memo(CharGroupComponent);
