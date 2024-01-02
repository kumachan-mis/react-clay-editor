import styled from '@emotion/styled';

export type SuggestionListItemProps = {
  readonly index: number;
} & React.PropsWithoutRef<React.ComponentProps<'li'>>;

export const SuggestionListItemConstants = {
  selectId: (index: number): string => `suggestion-item-${index}`,
};

export const SuggestionListItem: React.FC<SuggestionListItemProps> = ({ index, ...rest }) => (
  <StyledSuggestionListItem {...rest} data-selectid={SuggestionListItemConstants.selectId(index)} />
);

const StyledSuggestionListItem = styled.li(
  (props) => `
  list-style-type: none;
  cursor: pointer;
  padding: 2px 8px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  border-bottom: 1px solid ${props.theme.listItem.dividerColor};

  color: ${props.theme.listItem.unselectedColor};
  background-color: ${props.theme.listItem.unselectedBackgroundColor};
  &:hover {
    background-color: ${props.theme.listItem.unselectedHoverBackgroundColor};
  }

  &[aria-selected='true'] {
    color: ${props.theme.listItem.selectedColor};
    background-color: ${props.theme.listItem.selectedBackgroundColor};
    &:hover {
      background-color: ${props.theme.listItem.selectedHoverBackgroundColor};
    }
  }
`
);
