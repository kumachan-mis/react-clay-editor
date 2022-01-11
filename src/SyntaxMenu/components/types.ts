export type MenuContainerProps = Omit<React.ComponentProps<'div'>, 'ref'>;

export type IconButtonMenuProps = {
  active?: boolean;
  disabled?: boolean;
} & React.ComponentProps<'button'>;

export type DropdownMenuProps = React.ComponentProps<'span'>;

export type DropdownMenuAnchorProps = {
  open: boolean;
  onOpen: (anchorEl: HTMLElement) => void;
  onClose: () => void;
  buttonProps?: React.ComponentProps<'button'>;
  active?: boolean;
  disabled?: boolean;
} & React.ComponentProps<'div'>;

export type DropdownMenuListProps = {
  open: boolean;
  anchorEl: HTMLElement | null;
} & React.ComponentProps<'ul'>;

export type DropdownMenuItemProps = {
  active?: boolean;
  disabled?: boolean;
} & React.ComponentProps<'li'>;
