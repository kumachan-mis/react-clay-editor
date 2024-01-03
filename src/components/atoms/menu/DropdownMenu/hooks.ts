import * as React from 'react';

export function useDropdownMenu(): [boolean, () => void, () => void] {
  const [open, setOpen] = React.useState(false);
  return [
    open,
    () => {
      setOpen(true);
    },
    () => {
      setOpen(false);
    },
  ];
}
