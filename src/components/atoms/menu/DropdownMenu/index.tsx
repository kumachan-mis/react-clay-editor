import styled from '@emotion/styled';

export type DropdownMenuProps = React.PropsWithoutRef<React.ComponentProps<'span'>>;

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ ...rest }) => (
  <StyledDropdownMenu role="menuitem" {...rest} />
);

const StyledDropdownMenu = styled.span``;
