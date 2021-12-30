export type MenuContainerProps = React.ComponentProps<'div'>;

export type IconButtonMenuProps = React.ComponentProps<'button'>;

export type DropdownMenuProps = {
  onClose: () => void;
};

export type DropdownMenuAnchorProps = {
  open: boolean;
  onOpen: (anchorEl: HTMLElement) => void;
  onClose: () => void;
  buttonProps?: React.ComponentProps<'button'>;
  disabled?: boolean;
} & React.ComponentProps<'div'>;

export type DropdownMenuListProps = {
  open: boolean;
  anchorEl: HTMLElement | null;
} & React.ComponentProps<'ul'>;

export type DropdownMenuItemProps = React.ComponentProps<'li'>;
