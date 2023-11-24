import { SectionIcon } from '../../../../icons/Section';
import { DropdownMenu } from '../../../atoms/menu/DropdownMenu';
import { useDropdownMenu } from '../../../atoms/menu/DropdownMenu/hooks';
import { DropdownMenuButton } from '../../../atoms/menu/DropdownMenuButton';
import { DropdownMenuList } from '../../../atoms/menu/DropdownMenuList';
import { DropdownMenuListItem } from '../../../atoms/menu/DropdownMenuListItem';

import React from 'react';

export type SectionMenuProps = {
  readonly menuSwitch: 'off' | 'normal' | 'larger' | 'largest' | 'disabled';
  readonly normalLabel: string;
  readonly largerLabel: string;
  readonly largestLabel: string;
  readonly onButtonClick: () => void;
  readonly onNormalItemClick: () => void;
  readonly onLargerItemClick: () => void;
  readonly onLargestItemClick: () => void;
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
        buttonProps={{ onClick: onButtonClick }}
        disabled={menuSwitch === 'disabled'}
        onClose={onClose}
        onOpen={onOpen}
        open={open}
        pressed={menuSwitch !== 'off' && menuSwitch !== 'disabled'}
      >
        <SectionIcon />
      </DropdownMenuButton>
      <DropdownMenuList open={open}>
        <DropdownMenuListItem
          data-selectid={SectionMenuConstants.items.normal.selectId}
          onClick={onNormalItemClick}
          selected={menuSwitch === 'normal'}
        >
          {normalLabel}
        </DropdownMenuListItem>
        <DropdownMenuListItem
          data-selectid={SectionMenuConstants.items.larger.selectId}
          onClick={onLargerItemClick}
          selected={menuSwitch === 'larger'}
        >
          {largerLabel}
        </DropdownMenuListItem>
        <DropdownMenuListItem
          data-selectid={SectionMenuConstants.items.largest.selectId}
          onClick={onLargestItemClick}
          selected={menuSwitch === 'largest'}
        >
          {largestLabel}
        </DropdownMenuListItem>
      </DropdownMenuList>
    </DropdownMenu>
  );
};
