import React from 'react';

import { QuotationIcon } from '../../../../icons/Quotation';
import { DropdownMenu } from '../../../atoms/menu/DropdownMenu';
import { useDropdownMenu } from '../../../atoms/menu/DropdownMenu/hooks';
import { DropdownMenuButton } from '../../../atoms/menu/DropdownMenuButton';
import { DropdownMenuList } from '../../../atoms/menu/DropdownMenuList';
import { DropdownMenuListItem } from '../../../atoms/menu/DropdownMenuListItem';

export type QuotationMenuProps = {
  menuSwitch: 'alloff' | 'allon' | 'both' | 'disabled';
  indentLabel: string;
  outdentLabel: string;
  onButtonClick: () => void;
  onIndentItemClick: () => void;
  onOutdentItemClick: () => void;
};

export const QuotationMenuConstants = {
  selectId: 'quotation-menu',
  items: {
    indent: {
      defaultLabel: 'indent',
      selectId: 'indent-quotation-menu-item',
    },
    outdent: {
      defaultLabel: 'outdent',
      selectId: 'outdent-quotation-menu-item',
    },
  },
};

export const QuotationMenu: React.FC<QuotationMenuProps> = ({
  menuSwitch,
  indentLabel,
  outdentLabel,
  onButtonClick,
  onIndentItemClick,
  onOutdentItemClick,
}) => {
  const [open, anchorEl, onOpen, onClose] = useDropdownMenu();

  return (
    <DropdownMenu data-selectid={QuotationMenuConstants.selectId}>
      <DropdownMenuButton
        open={open}
        onOpen={onOpen}
        onClose={onClose}
        pressed={menuSwitch === 'allon'}
        disabled={menuSwitch === 'disabled'}
        buttonProps={{ onClick: onButtonClick }}
      >
        <QuotationIcon />
      </DropdownMenuButton>
      <DropdownMenuList open={open} anchorEl={anchorEl}>
        <DropdownMenuListItem onClick={onIndentItemClick} data-selectid={QuotationMenuConstants.items.indent.selectId}>
          {indentLabel}
        </DropdownMenuListItem>
        <DropdownMenuListItem
          disabled={menuSwitch === 'alloff'}
          onClick={onOutdentItemClick}
          data-selectid={QuotationMenuConstants.items.outdent.selectId}
        >
          {outdentLabel}
        </DropdownMenuListItem>
      </DropdownMenuList>
    </DropdownMenu>
  );
};
