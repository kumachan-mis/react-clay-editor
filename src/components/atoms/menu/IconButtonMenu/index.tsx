import styled from '@emotion/styled';

export type IconButtonMenuProps = {
  readonly pressed?: boolean;
} & React.PropsWithoutRef<React.ComponentProps<'button'>>;

export const IconButtonMenu: React.FC<IconButtonMenuProps> = ({ pressed, ...rest }) => (
  <StyledIconButtonMenu aria-pressed={pressed} role="menuitem" {...rest} />
);

const StyledIconButtonMenu = styled.button(
  (props) => `
  width: 26px;
  height: 26px;
  padding: 1px;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid ${props.theme.iconButton.borderColor};
  cursor: pointer;

  background-color: ${props.theme.iconButton.unselectedBackgroundColor};
  &:hover {
    background-color: ${props.theme.iconButton.unselectedHoverBackgroundColor};
  }
  svg {
    fill: ${props.theme.iconButton.unselectedIconColor};
    width: 16px;
    height: 16px;
  }


  &[aria-pressed='true'] {
    background-color: ${props.theme.iconButton.selectedBackgroundColor};
    &:hover {
      background-color: ${props.theme.iconButton.selectedHoverBackgroundColor};
    }
    svg {
      fill: ${props.theme.iconButton.unselectedIconColor};
    }
  }

  &:disabled {
    background-color: ${props.theme.iconButton.disabledBackgroundColor};
    cursor: unset;
    svg {
      fill: ${props.theme.iconButton.disabledIconColor};
    }
  }
`,
);
