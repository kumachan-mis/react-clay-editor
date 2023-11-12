import styled from '@emotion/styled';
import React from 'react';

export type SuggestionListHeaderProps = {
  suggestionType: 'text' | 'bracketLink' | 'hashtag' | 'taggedLink' | 'none';
};

export const SuggestionListHeaderConstants = {
  selectId: 'suggestion-header',

  name: (suggestionType: 'text' | 'bracketLink' | 'hashtag' | 'taggedLink' | 'none'): string => {
    switch (suggestionType) {
      case 'text':
        return 'Text Suggestion';
      case 'bracketLink':
        return 'Bracket Link Suggestion';
      case 'hashtag':
        return 'Hashtag Suggestion';
      case 'taggedLink':
        return 'Tagged Link Suggestion';
      default:
        return '';
    }
  },
};

export const SuggestionListHeader: React.FC<SuggestionListHeaderProps> = ({ suggestionType }) => (
  <StyledSuggestionListHeader data-selectid={SuggestionListHeaderConstants.selectId}>
    {SuggestionListHeaderConstants.name(suggestionType)}
  </StyledSuggestionListHeader>
);

const StyledSuggestionListHeader = styled.div(
  (props) => `
  width: 100%;
  box-sizing: border-box;
  padding: 4px;
  border-radius: 8px 8px 0px 0px;
  border-bottom: 1px solid ${props.theme.listItem.dividerColor};
  white-space: nowrap;
  text-align: center;
  font-weight: bold;
`
);
