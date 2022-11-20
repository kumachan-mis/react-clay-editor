import React from 'react';

import { createTestId } from '../../../../common/utils';
import { ItemizationIcon } from '../../../../icons/Itemization';
import { DropdownMenu } from '../../../atoms/menu/DropdownMenu';
import { useDropdownMenu } from '../../../atoms/menu/DropdownMenu/hooks';
import { DropdownMenuButton } from '../../../atoms/menu/DropdownMenuButton';
import { DropdownMenuList } from '../../../atoms/menu/DropdownMenuList';
import { DropdownMenuListItem } from '../../../atoms/menu/DropdownMenuListItem';

export type ItemizationMenuProps = {
  menuSwitch: 'alloff' | 'allon' | 'both' | 'disabled';
  indentLabel: string;
  outdentLabel: string;
  onButtonClick: () => void;
  onIndentItemClick: () => void;
  onOutdentItemClick: () => void;
};

export const ItemizationMenuConstants = {
  testId: 'itemization-menu',
  items: {
    indent: {
      defaultLabel: 'indent',
      testId: 'indent-itemization-menu-item',
    },
    outdent: {
      defaultLabel: 'outdent',
      testId: 'outdent-itemization-menu-item',
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
    <DropdownMenu>
      <DropdownMenuButton
        open={open}
        onOpen={onOpen}
        onClose={onClose}
        pressed={menuSwitch === 'allon'}
        disabled={menuSwitch === 'disabled'}
        buttonProps={{ onClick: onButtonClick }}
        data-testid={createTestId(ItemizationMenuConstants.testId)}
      >
        <ItemizationIcon />
      </DropdownMenuButton>
      <DropdownMenuList open={open} anchorEl={anchorEl}>
        <DropdownMenuListItem
          onClick={onIndentItemClick}
          data-testid={createTestId(ItemizationMenuConstants.items.indent.testId)}
        >
          {indentLabel}
        </DropdownMenuListItem>
        <DropdownMenuListItem
          disabled={menuSwitch === 'alloff'}
          onClick={onOutdentItemClick}
          data-testid={createTestId(ItemizationMenuConstants.items.outdent.testId)}
        >
          {outdentLabel}
        </DropdownMenuListItem>
      </DropdownMenuList>
    </DropdownMenu>
  );
};