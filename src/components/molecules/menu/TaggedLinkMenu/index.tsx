import React from 'react';

import { TaggedlinkIcon } from '../../../../icons/TaggedlinkIcon';
import { DropdownMenu } from '../../../atoms/menu/DropdownMenu';
import { useDropdownMenu } from '../../../atoms/menu/DropdownMenu/hooks';
import { DropdownMenuButton } from '../../../atoms/menu/DropdownMenuButton';
import { DropdownMenuList } from '../../../atoms/menu/DropdownMenuList';
import { DropdownMenuListItem } from '../../../atoms/menu/DropdownMenuListItem';

export type TaggedLinkMenuProps = {
  menuSwitch: 'on' | 'off' | 'disabled';
  activeTagName: string | undefined;
  taggedItemMap: { [tagName: string]: { label: string; onItemClick: () => void } };
};

export const TaggedLinkMenuConstants = {
  items: {
    defaultLabel: 'tagged link',
    taggedLabel: (tagName: string, label: string) => `${tagName}: ${label}`,
  },
};

export const TaggedLinkMenu: React.FC<TaggedLinkMenuProps> = ({ menuSwitch, activeTagName, taggedItemMap }) => {
  const [open, anchorEl, onOpen, onClose] = useDropdownMenu();
  const tagEntries = Object.entries(taggedItemMap);

  let onButtonClick = undefined;
  if (activeTagName) onButtonClick = taggedItemMap[activeTagName].onItemClick;
  else if (tagEntries.length > 0) onButtonClick = tagEntries[0][1].onItemClick;

  return (
    <DropdownMenu>
      <DropdownMenuButton
        open={open}
        onOpen={onOpen}
        onClose={onClose}
        pressed={menuSwitch === 'on'}
        disabled={menuSwitch === 'disabled'}
        buttonProps={{ onClick: onButtonClick }}
      >
        <TaggedlinkIcon />
      </DropdownMenuButton>
      <DropdownMenuList open={open} anchorEl={anchorEl}>
        {tagEntries.map(([tagName, { label, onItemClick }]) => (
          <DropdownMenuListItem key={tagName} selected={tagName === activeTagName} onClick={onItemClick}>
            {TaggedLinkMenuConstants.items.taggedLabel(tagName, label)}
          </DropdownMenuListItem>
        ))}
      </DropdownMenuList>
    </DropdownMenu>
  );
};
