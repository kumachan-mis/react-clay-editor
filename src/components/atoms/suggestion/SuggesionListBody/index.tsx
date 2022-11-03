import styled from '@emotion/styled';
import React from 'react';

export type SuggestionListBodyProps = React.ComponentProps<'ul'>;

export const SuggestionListBodyConstants = {
  selectId: 'suggestion-body',
  testId: 'suggestion-body',
};

export const SuggestionListBody: React.FC<SuggestionListBodyProps> = ({ ...rest }) => (
  <StyledSuggestionListBody
    {...rest}
    data-selectid={SuggestionListBodyConstants.selectId}
    data-testid={SuggestionListBodyConstants.testId}
  />
);

const StyledSuggestionListBody = styled.ul`
  position: relative;
  width: 100%;
  max-height: 100px;
  margin: 0px;
  padding: 0px;
  border-radius: 0px 0px 8px 8px;
  overflow-y: scroll;
  background-color: rgba(0, 0, 0, 0.04);
`;
