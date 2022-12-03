import styled from '@emotion/styled';
import React from 'react';

export type SuggestionListItemProps = {
  index: number;
} & React.PropsWithoutRef<React.ComponentProps<'li'>>;

export const SuggestionListItemConstants = {
  selectId: (index: number): string => `suggestion-item-${index}`,
  testId: (index: number): string => `suggestion-item-${index}`,
};

export const SuggestionListItem: React.FC<SuggestionListItemProps> = ({ index, ...rest }) => (
  <StyledSuggestionListItem {...rest} data-selectid={SuggestionListItemConstants.selectId(index)} />
);

const StyledSuggestionListItem = styled.li`
  list-style-type: none;
  cursor: pointer;
  padding: 2px 8px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  &[aria-selected='true'] {
    background-color: #eff7ff;
  }
  &:hover {
    background-color: #d9e9f7;
  }
`;
