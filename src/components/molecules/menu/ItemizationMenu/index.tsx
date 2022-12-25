import { DropdownMenu } from 'src/components/atoms/menu/DropdownMenu';
import { useDropdownMenu } from 'src/components/atoms/menu/DropdownMenu/hooks';
import { DropdownMenuButton } from 'src/components/atoms/menu/DropdownMenuButton';
import { DropdownMenuList } from 'src/components/atoms/menu/DropdownMenuList';
import { DropdownMenuListItem } from 'src/components/atoms/menu/DropdownMenuListItem';
import { ItemizationIcon } from 'src/icons/Itemization';

import React from 'react';

export type ItemizationMenuProps = {
  menuSwitch: 'alloff' | 'allon' | 'both' | 'disabled';
  indentLabel: string;
  outdentLabel: string;
  onButtonClick: () => void;
  onIndentItemClick: () => void;
  onOutdentItemClick: () => void;
};

export const ItemizationMenuConstants = {
  selectId: 'itemization-menu',
  items: {
    indent: {
      defaultLabel: 'indent',
      selectId: 'indent-itemization-menu-item',
    },
    outdent: {
      defaultLabel: 'outdent',
      selectId: 'outdent-itemization-menu-item',
    },
  },
};

export const ItemizationMenu: React.FC<ItemizationMenuProps> = ({
  menuSwitch,
  indentLabel,
  outdentLabel,
  onButtonClick,
  onIndentItemClick,
  onOutdentItemClick,
}) => {
  const [open, anchorEl, onOpen, onClose] = useDropdownMenu();

  return (
    <DropdownMenu data-selectid={ItemizationMenuConstants.selectId}>
      <DropdownMenuButton
        open={open}
        onOpen={onOpen}
        onClose={onClose}
        pressed={menuSwitch === 'allon'}
        disabled={menuSwitch === 'disabled'}
        buttonProps={{ onClick: onButtonClick }}
      >
        <ItemizationIcon />
      </DropdownMenuButton>
      <DropdownMenuList open={open} anchorEl={anchorEl}>
        <DropdownMenuListItem
          onClick={onIndentItemClick}
          data-selectid={ItemizationMenuConstants.items.indent.selectId}
        >
          {indentLabel}
        </DropdownMenuListItem>
        <DropdownMenuListItem
          disabled={menuSwitch === 'alloff'}
          onClick={onOutdentItemClick}
          data-selectid={ItemizationMenuConstants.items.outdent.selectId}
        >
          {outdentLabel}
        </DropdownMenuListItem>
      </DropdownMenuList>
    </DropdownMenu>
  );
};
