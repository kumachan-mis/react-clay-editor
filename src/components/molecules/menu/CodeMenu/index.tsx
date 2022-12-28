import { CodeIcon } from '../../../../icons/CodeIcon';
import { DropdownMenu } from '../../../atoms/menu/DropdownMenu';
import { useDropdownMenu } from '../../../atoms/menu/DropdownMenu/hooks';
import { DropdownMenuButton } from '../../../atoms/menu/DropdownMenuButton';
import { DropdownMenuList } from '../../../atoms/menu/DropdownMenuList';
import { DropdownMenuListItem } from '../../../atoms/menu/DropdownMenuListItem';

import React from 'react';

export type CodeMenuProps = {
  inlineMenuSwitch: 'on' | 'off' | 'disabled';
  blockMenuSwitch: 'on' | 'off' | 'disabled';
  inlineLabel: string;
  blockLabel: string;
  onButtonClick: () => void;
  onInlineItemClick: () => void;
  onBlockItemClick: () => void;
};

export const CodeMenuConstants = {
  selectId: 'code-menu',
  items: {
    inline: {
      defaultLabel: 'inline code',
      selectId: 'inline-code-menu-item',
    },
    block: {
      defaultLabel: 'block code',
      selectId: 'block-code-menu-item',
    },
  },
};

export const CodeMenu: React.FC<CodeMenuProps> = ({
  inlineMenuSwitch,
  blockMenuSwitch,
  inlineLabel,
  blockLabel,
  onButtonClick,
  onInlineItemClick,
  onBlockItemClick,
}) => {
  const [open, onOpen, onClose] = useDropdownMenu();

  return (
    <DropdownMenu data-selectid={CodeMenuConstants.selectId}>
      <DropdownMenuButton
        open={open}
        onOpen={onOpen}
        onClose={onClose}
        pressed={inlineMenuSwitch === 'on' || blockMenuSwitch === 'on'}
        disabled={inlineMenuSwitch === 'disabled' && blockMenuSwitch === 'disabled'}
        buttonProps={{ onClick: onButtonClick }}
      >
        <CodeIcon />
      </DropdownMenuButton>
      <DropdownMenuList open={open}>
        <DropdownMenuListItem
          selected={inlineMenuSwitch === 'on'}
          disabled={inlineMenuSwitch === 'disabled'}
          onClick={onInlineItemClick}
          data-selectid={CodeMenuConstants.items.inline.selectId}
        >
          {inlineLabel}
        </DropdownMenuListItem>
        <DropdownMenuListItem
          selected={blockMenuSwitch === 'on'}
          disabled={blockMenuSwitch === 'disabled'}
          onClick={onBlockItemClick}
          data-selectid={CodeMenuConstants.items.block.selectId}
        >
          {blockLabel}
        </DropdownMenuListItem>
      </DropdownMenuList>
    </DropdownMenu>
  );
};
