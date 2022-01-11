import * as React from 'react';

export function useDropdownMenu(): [boolean, HTMLElement | null, (anchorEl: HTMLElement) => void, () => void] {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  return [!!anchorEl, anchorEl, (anchorEl) => setAnchorEl(anchorEl), () => setAnchorEl(null)];
}
