import React from 'react';

import { SectionIcon } from '../../../../icons/Section';
import { DropdownMenu } from '../../../atoms/menu/DropdownMenu';
import { useDropdownMenu } from '../../../atoms/menu/DropdownMenu/hooks';
import { DropdownMenuButton } from '../../../atoms/menu/DropdownMenuButton';
import { DropdownMenuList } from '../../../atoms/menu/DropdownMenuList';
import { DropdownMenuListItem } from '../../../atoms/menu/DropdownMenuListItem';

export type SectionMenuProps = {
  menuSwitch: 'off' | 'normal' | 'larger' | 'largest' | 'disabled';
  normalLabel: string;
  largerLabel: string;
  largestLabel: string;
  onButtonClick: () => void;
  onNormalItemClick: () => void;
  onLargerItemClick: () => void;
  onLargestItemClick: () => void;
};

export const SectionMenuConstants = {
  items: {
    normal: {
      defaultLabel: 'normal',
    },
    larger: {
      defaultLabel: 'larger',
    },
    largest: {
      defaultLabel: 'largest',
    },
  },
};

export const SectionMenu: React.FC<SectionMenuProps> = ({
  menuSwitch,
  normalLabel,
  largerLabel,
  largestLabel,
  onButtonClick,
  onNormalItemClick,
  onLargerItemClick,
  onLargestItemClick,
}) => {
  const [open, anchorEl, onOpen, onClose] = useDropdownMenu();

  return (
    <DropdownMenu>
      <DropdownMenuButton
        open={open}
        onOpen={onOpen}
        onClose={onClose}
        pressed={menuSwitch !== 'off' && menuSwitch !== 'disabled'}
        disabled={menuSwitch === 'disabled'}
        buttonProps={{ onClick: onButtonClick }}
      >
        <SectionIcon />
      </DropdownMenuButton>
      <DropdownMenuList open={open} anchorEl={anchorEl}>
        <DropdownMenuListItem selected={menuSwitch === 'normal'} onClick={onNormalItemClick}>
          {normalLabel}
        </DropdownMenuListItem>
        <DropdownMenuListItem selected={menuSwitch === 'larger'} onClick={onLargerItemClick}>
          {largerLabel}
        </DropdownMenuListItem>
        <DropdownMenuListItem selected={menuSwitch === 'largest'} onClick={onLargestItemClick}>
          {largestLabel}
        </DropdownMenuListItem>
      </DropdownMenuList>
    </DropdownMenu>
  );
};
