import { FormulaIcon } from '../../../../icons/FormulaIcon';
import { DropdownMenu } from '../../../atoms/menu/DropdownMenu';
import { useDropdownMenu } from '../../../atoms/menu/DropdownMenu/hooks';
import { DropdownMenuButton } from '../../../atoms/menu/DropdownMenuButton';
import { DropdownMenuList } from '../../../atoms/menu/DropdownMenuList';
import { DropdownMenuListItem } from '../../../atoms/menu/DropdownMenuListItem';

import React from 'react';

export type FormulaMenuProps = {
  contentMenuSwitch: 'inline' | 'display' | 'off' | 'disabled';
  blockMenuSwitch: 'on' | 'off' | 'disabled';
  inlineLabel: string;
  displayLabel: string;
  blockLabel: string;
  onButtonClick: () => void;
  onInlineItemClick: () => void;
  onDisplayItemClick: () => void;
  onBlockItemClick: () => void;
};

export const FormulaMenuConstants = {
  selectId: 'formula-menu',
  items: {
    inline: {
      defaultLabel: 'inline formula',
      selectId: 'inline-formula-menu-item',
    },
    display: {
      defaultLabel: 'display formula',
      selectId: 'display-formula-menu-item',
    },
    block: {
      defaultLabel: 'block formula',
      selectId: 'block-formula-menu-item',
    },
  },
};

export const FormulaMenu: React.FC<FormulaMenuProps> = ({
  contentMenuSwitch,
  blockMenuSwitch,
  inlineLabel,
  displayLabel,
  blockLabel,
  onButtonClick,
  onInlineItemClick,
  onDisplayItemClick,
  onBlockItemClick,
}) => {
  const [open, onOpen, onClose] = useDropdownMenu();

  return (
    <DropdownMenu data-selectid={FormulaMenuConstants.selectId}>
      <DropdownMenuButton
        open={open}
        onOpen={onOpen}
        onClose={onClose}
        pressed={contentMenuSwitch === 'inline' || contentMenuSwitch === 'display' || blockMenuSwitch === 'on'}
        disabled={contentMenuSwitch === 'disabled' && blockMenuSwitch === 'disabled'}
        buttonProps={{ onClick: onButtonClick }}
      >
        <FormulaIcon />
      </DropdownMenuButton>
      <DropdownMenuList open={open}>
        <DropdownMenuListItem
          selected={contentMenuSwitch === 'inline'}
          disabled={contentMenuSwitch === 'disabled'}
          onClick={onInlineItemClick}
          data-selectid={FormulaMenuConstants.items.inline.selectId}
        >
          {inlineLabel}
        </DropdownMenuListItem>
        <DropdownMenuListItem
          selected={contentMenuSwitch === 'display'}
          disabled={contentMenuSwitch === 'disabled'}
          onClick={onDisplayItemClick}
          data-selectid={FormulaMenuConstants.items.display.selectId}
        >
          {displayLabel}
        </DropdownMenuListItem>
        <DropdownMenuListItem
          selected={blockMenuSwitch === 'on'}
          disabled={blockMenuSwitch === 'disabled'}
          onClick={onBlockItemClick}
          data-selectid={FormulaMenuConstants.items.block.selectId}
        >
          {blockLabel}
        </DropdownMenuListItem>
      </DropdownMenuList>
    </DropdownMenu>
  );
};
