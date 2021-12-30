export type MenuContainerProps = React.ComponentProps<'div'>;

export type IconButtonMenuProps = {
  disabled?: boolean;
} & React.ComponentProps<'button'>;

export type DropdownMenuProps = {
  onClose: () => void;
  disabled?: boolean;
};

export type DropdownMenuAnchorProps = {
  open: boolean;
  onOpen: (anchorEl: HTMLElement) => void;
  onClose: () => void;
  disabled?: boolean;
} & React.ComponentProps<'button'>;

export type DropdownMenuListProps = {
  open: boolean;
  anchorEl: HTMLElement | null;
  disabled?: boolean;
} & React.ComponentProps<'ul'>;

export type DropdownMenuItemProps = {
  disabled?: boolean;
} & React.ComponentProps<'li'>;
