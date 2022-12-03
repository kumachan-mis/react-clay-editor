import React from 'react';

import { CodeIcon } from '../../../../icons/CodeIcon';
import { DropdownMenu } from '../../../atoms/menu/DropdownMenu';
import { useDropdownMenu } from '../../../atoms/menu/DropdownMenu/hooks';
import { DropdownMenuButton } from '../../../atoms/menu/DropdownMenuButton';
import { DropdownMenuList } from '../../../atoms/menu/DropdownMenuList';
import { DropdownMenuListItem } from '../../../atoms/menu/DropdownMenuListItem';

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
  testId: 'code-menu',
  items: {
    inline: {
      defaultLabel: 'inline code',
      testId: 'inline-code-menu-item',
    },
    block: {
      defaultLabel: 'block code',
      testId: 'block-code-menu-item',
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
    <DropdownMenu>
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
        >
          {inlineLabel}
        </DropdownMenuListItem>
        <DropdownMenuListItem
          selected={blockMenuSwitch === 'on'}
          disabled={blockMenuSwitch === 'disabled'}
          onClick={onBlockItemClick}
        >
          {blockLabel}
        </DropdownMenuListItem>
      </DropdownMenuList>
    </DropdownMenu>
  );
};
