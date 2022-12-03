import React from 'react';

import { createTestId } from '../../../../common/utils';
import { FormulaIcon } from '../../../../icons/FormulaIcon';
import { DropdownMenu } from '../../../atoms/menu/DropdownMenu';
import { useDropdownMenu } from '../../../atoms/menu/DropdownMenu/hooks';
import { DropdownMenuButton } from '../../../atoms/menu/DropdownMenuButton';
import { DropdownMenuList } from '../../../atoms/menu/DropdownMenuList';
import { DropdownMenuListItem } from '../../../atoms/menu/DropdownMenuListItem';

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
  testId: 'formula-menu',
  items: {
    inline: {
      defaultLabel: 'inline formula',
      testId: 'inline-formula-menu-item',
    },
    display: {
      defaultLabel: 'display formula',
      testId: 'display-formula-menu-item',
    },
    block: {
      defaultLabel: 'block formula',
      testId: 'block-formula-menu-item',
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
  const [open, anchorEl, onOpen, onClose] = useDropdownMenu();

  return (
    <DropdownMenu>
      <DropdownMenuButton
        open={open}
        onOpen={onOpen}
        onClose={onClose}
        pressed={contentMenuSwitch === 'inline' || contentMenuSwitch === 'display' || blockMenuSwitch === 'on'}
        disabled={contentMenuSwitch === 'disabled' && blockMenuSwitch === 'disabled'}
        buttonProps={{ onClick: onButtonClick }}
        data-testid={createTestId(FormulaMenuConstants.testId)}
      >
        <FormulaIcon />
      </DropdownMenuButton>
      <DropdownMenuList open={open} anchorEl={anchorEl}>
        <DropdownMenuListItem
          selected={contentMenuSwitch === 'inline'}
          disabled={contentMenuSwitch === 'disabled'}
          onClick={onInlineItemClick}
          data-testid={createTestId(FormulaMenuConstants.items.inline.testId)}
        >
          {inlineLabel}
        </DropdownMenuListItem>
        <DropdownMenuListItem
          selected={contentMenuSwitch === 'display'}
          disabled={contentMenuSwitch === 'disabled'}
          onClick={onDisplayItemClick}
          data-testid={createTestId(FormulaMenuConstants.items.display.testId)}
        >
          {displayLabel}
        </DropdownMenuListItem>
        <DropdownMenuListItem
          selected={blockMenuSwitch === 'on'}
          disabled={blockMenuSwitch === 'disabled'}
          onClick={onBlockItemClick}
          data-testid={createTestId(FormulaMenuConstants.items.block.testId)}
        >
          {blockLabel}
        </DropdownMenuListItem>
      </DropdownMenuList>
    </DropdownMenu>
  );
};
