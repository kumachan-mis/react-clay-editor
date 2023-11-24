import { QuotationIcon } from '../../../../icons/Quotation';
import { DropdownMenu } from '../../../atoms/menu/DropdownMenu';
import { useDropdownMenu } from '../../../atoms/menu/DropdownMenu/hooks';
import { DropdownMenuButton } from '../../../atoms/menu/DropdownMenuButton';
import { DropdownMenuList } from '../../../atoms/menu/DropdownMenuList';
import { DropdownMenuListItem } from '../../../atoms/menu/DropdownMenuListItem';

import React from 'react';

export type QuotationMenuProps = {
  readonly menuSwitch: 'alloff' | 'allon' | 'both' | 'disabled';
  readonly indentLabel: string;
  readonly outdentLabel: string;
  readonly onButtonClick: () => void;
  readonly onIndentItemClick: () => void;
  readonly onOutdentItemClick: () => void;
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
  const [open, onOpen, onClose] = useDropdownMenu();

  return (
    <DropdownMenu data-selectid={QuotationMenuConstants.selectId}>
      <DropdownMenuButton
        buttonProps={{ onClick: onButtonClick }}
        disabled={menuSwitch === 'disabled'}
        onClose={onClose}
        onOpen={onOpen}
        open={open}
        pressed={menuSwitch === 'allon'}
      >
        <QuotationIcon />
      </DropdownMenuButton>
      <DropdownMenuList open={open}>
        <DropdownMenuListItem data-selectid={QuotationMenuConstants.items.indent.selectId} onClick={onIndentItemClick}>
          {indentLabel}
        </DropdownMenuListItem>
        <DropdownMenuListItem
          data-selectid={QuotationMenuConstants.items.outdent.selectId}
          disabled={menuSwitch === 'alloff'}
          onClick={onOutdentItemClick}
        >
          {outdentLabel}
        </DropdownMenuListItem>
      </DropdownMenuList>
    </DropdownMenu>
  );
};
