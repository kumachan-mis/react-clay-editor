import { DropdownMenu } from 'src/components/atoms/menu/DropdownMenu';
import { useDropdownMenu } from 'src/components/atoms/menu/DropdownMenu/hooks';
import { DropdownMenuButton } from 'src/components/atoms/menu/DropdownMenuButton';
import { DropdownMenuList } from 'src/components/atoms/menu/DropdownMenuList';
import { DropdownMenuListItem } from 'src/components/atoms/menu/DropdownMenuListItem';
import { SectionIcon } from 'src/icons/Section';

import React from 'react';

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
  selectId: 'section-menu',
  items: {
    normal: {
      defaultLabel: 'normal',
      selectId: 'normal-section-menu-item',
    },
    larger: {
      defaultLabel: 'larger',
      selectId: 'larger-section-menu-item',
    },
    largest: {
      defaultLabel: 'largest',
      selectId: 'largest-section-menu-item',
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
  const [open, onOpen, onClose] = useDropdownMenu();

  return (
    <DropdownMenu data-selectid={SectionMenuConstants.selectId}>
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
      <DropdownMenuList open={open}>
        <DropdownMenuListItem
          selected={menuSwitch === 'normal'}
          onClick={onNormalItemClick}
          data-selectid={SectionMenuConstants.items.normal.selectId}
        >
          {normalLabel}
        </DropdownMenuListItem>
        <DropdownMenuListItem
          selected={menuSwitch === 'larger'}
          onClick={onLargerItemClick}
          data-selectid={SectionMenuConstants.items.larger.selectId}
        >
          {largerLabel}
        </DropdownMenuListItem>
        <DropdownMenuListItem
          selected={menuSwitch === 'largest'}
          onClick={onLargestItemClick}
          data-selectid={SectionMenuConstants.items.largest.selectId}
        >
          {largestLabel}
        </DropdownMenuListItem>
      </DropdownMenuList>
    </DropdownMenu>
  );
};
