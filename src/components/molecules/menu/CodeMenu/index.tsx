import { DropdownMenu } from 'src/components/atoms/menu/DropdownMenu';
import { useDropdownMenu } from 'src/components/atoms/menu/DropdownMenu/hooks';
import { DropdownMenuButton } from 'src/components/atoms/menu/DropdownMenuButton';
import { DropdownMenuList } from 'src/components/atoms/menu/DropdownMenuList';
import { DropdownMenuListItem } from 'src/components/atoms/menu/DropdownMenuListItem';
import { CodeIcon } from 'src/icons/CodeIcon';

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
  const [open, anchorEl, onOpen, onClose] = useDropdownMenu();

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
      <DropdownMenuList open={open} anchorEl={anchorEl}>
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
