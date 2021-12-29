export type IconButtonProps = React.ComponentProps<'button'>;

export type DropdownAnchorProps = {
  open: boolean;
  onOpen?: (anchorEl: HTMLElement) => void;
  onClose?: () => void;
} & React.ComponentProps<'button'>;

export type DropdownMenuProps = {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose?: () => void;
} & React.ComponentProps<'ul'>;

export type DropdownMenuItemProps = React.ComponentProps<'li'>;
