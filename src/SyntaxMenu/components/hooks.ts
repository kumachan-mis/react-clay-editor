import * as React from 'react';

export function useDropdownMenu(): [boolean, HTMLElement | null, (anchorEl: HTMLElement) => void, () => void] {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const handleOnOpen = React.useCallback((anchorEl: HTMLElement) => setAnchorEl(anchorEl), [setAnchorEl]);
  const handleOnClose = React.useCallback(() => setAnchorEl(null), [setAnchorEl]);
  return [!!anchorEl, anchorEl, handleOnOpen, handleOnClose];
}
