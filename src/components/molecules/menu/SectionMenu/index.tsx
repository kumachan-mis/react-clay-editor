import React from 'react';

import { createTestId } from '../../../../common/utils';
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
  testId: 'section-menu',
  items: {
    normal: {
      defaultLabel: 'normal',
      testId: 'normal-section-menu-item',
    },
    larger: {
      defaultLabel: 'larger',
      testId: 'larger-section-menu-item',
    },
    largest: {
      defaultLabel: 'largest',
      testId: 'largest-section-menu-item',
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
        data-testid={createTestId(SectionMenuConstants.testId)}
      >
        <SectionIcon />
      </DropdownMenuButton>
      <DropdownMenuList open={open} anchorEl={anchorEl}>
        <DropdownMenuListItem
          selected={menuSwitch === 'normal'}
          onClick={onNormalItemClick}
          data-testid={createTestId(SectionMenuConstants.items.normal.testId)}
        >
          {normalLabel}
        </DropdownMenuListItem>
        <DropdownMenuListItem
          selected={menuSwitch === 'larger'}
          onClick={onLargerItemClick}
          data-testid={createTestId(SectionMenuConstants.items.larger.testId)}
        >
          {largerLabel}
        </DropdownMenuListItem>
        <DropdownMenuListItem
          selected={menuSwitch === 'largest'}
          onClick={onLargestItemClick}
          data-testid={createTestId(SectionMenuConstants.items.largest.testId)}
        >
          {largestLabel}
        </DropdownMenuListItem>
      </DropdownMenuList>
    </DropdownMenu>
  );
};
