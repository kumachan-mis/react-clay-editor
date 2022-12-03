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
  testId: 'quotation-menu',
  items: {
    indent: {
      defaultLabel: 'indent',
      testId: 'indent-quotation-menu-item',
    },
    outdent: {
      defaultLabel: 'outdent',
      testId: 'outdent-quotation-menu-item',
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
    <DropdownMenu>
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
        <DropdownMenuListItem onClick={onIndentItemClick}>{indentLabel}</DropdownMenuListItem>
        <DropdownMenuListItem disabled={menuSwitch === 'alloff'} onClick={onOutdentItemClick}>
          {outdentLabel}
        </DropdownMenuListItem>
      </DropdownMenuList>
    </DropdownMenu>
  );
};
