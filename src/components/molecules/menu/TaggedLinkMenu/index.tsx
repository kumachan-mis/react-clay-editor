import { TaggedlinkIcon } from '../../../../icons/TaggedlinkIcon';
import { DropdownMenu } from '../../../atoms/menu/DropdownMenu';
import { useDropdownMenu } from '../../../atoms/menu/DropdownMenu/hooks';
import { DropdownMenuButton } from '../../../atoms/menu/DropdownMenuButton';
import { DropdownMenuList } from '../../../atoms/menu/DropdownMenuList';
import { DropdownMenuListItem } from '../../../atoms/menu/DropdownMenuListItem';

export type TaggedLinkMenuProps = {
  readonly menuSwitch: 'on' | 'off' | 'disabled';
  readonly activeTagName: string | undefined;
  readonly taggedItemMap: Record<string, { label: string; onItemClick: () => void }>;
};

export const TaggedLinkMenuConstants = {
  selectId: 'tagged-link-menu',
  items: {
    defaultLabel: 'tagged link',
    taggedLabel: (tagName: string, label: string) => `${tagName}: ${label}`,
    selectId: (tagName: string) => `${tagName}-tagged-link-menu-item`,
  },
};

export const TaggedLinkMenu: React.FC<TaggedLinkMenuProps> = ({ menuSwitch, activeTagName, taggedItemMap }) => {
  const [open, onOpen, onClose] = useDropdownMenu();
  const tagEntries = Object.entries(taggedItemMap);

  let onButtonClick = undefined;
  if (activeTagName) onButtonClick = taggedItemMap[activeTagName].onItemClick;
  else if (tagEntries.length > 0) onButtonClick = tagEntries[0][1].onItemClick;

  return (
    <DropdownMenu data-selectid={TaggedLinkMenuConstants.selectId}>
      <DropdownMenuButton
        buttonProps={{ onClick: onButtonClick }}
        disabled={menuSwitch === 'disabled'}
        onClose={onClose}
        onOpen={onOpen}
        open={open}
        pressed={menuSwitch === 'on'}
      >
        <TaggedlinkIcon />
      </DropdownMenuButton>
      <DropdownMenuList open={open}>
        {tagEntries.map(([tagName, { label, onItemClick }]) => (
          <DropdownMenuListItem
            data-selectid={TaggedLinkMenuConstants.items.selectId(tagName)}
            key={tagName}
            onClick={onItemClick}
            selected={tagName === activeTagName}
          >
            {TaggedLinkMenuConstants.items.taggedLabel(tagName, label)}
          </DropdownMenuListItem>
        ))}
      </DropdownMenuList>
    </DropdownMenu>
  );
};
