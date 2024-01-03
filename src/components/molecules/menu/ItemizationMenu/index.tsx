import { ItemizationIcon } from '../../../../icons/Itemization';
import { DropdownMenu } from '../../../atoms/menu/DropdownMenu';
import { useDropdownMenu } from '../../../atoms/menu/DropdownMenu/hooks';
import { DropdownMenuButton } from '../../../atoms/menu/DropdownMenuButton';
import { DropdownMenuList } from '../../../atoms/menu/DropdownMenuList';
import { DropdownMenuListItem } from '../../../atoms/menu/DropdownMenuListItem';

export type ItemizationMenuProps = {
  readonly menuSwitch: 'alloff' | 'allon' | 'both' | 'disabled';
  readonly indentLabel: string;
  readonly outdentLabel: string;
  readonly onButtonClick: () => void;
  readonly onIndentItemClick: () => void;
  readonly onOutdentItemClick: () => void;
};

export const ItemizationMenuConstants = {
  selectId: 'itemization-menu',
  items: {
    indent: {
      defaultLabel: 'indent',
      selectId: 'indent-itemization-menu-item',
    },
    outdent: {
      defaultLabel: 'outdent',
      selectId: 'outdent-itemization-menu-item',
    },
  },
};

export const ItemizationMenu: React.FC<ItemizationMenuProps> = ({
  menuSwitch,
  indentLabel,
  outdentLabel,
  onButtonClick,
  onIndentItemClick,
  onOutdentItemClick,
}) => {
  const [open, onOpen, onClose] = useDropdownMenu();

  return (
    <DropdownMenu data-selectid={ItemizationMenuConstants.selectId}>
      <DropdownMenuButton
        buttonProps={{ onClick: onButtonClick }}
        disabled={menuSwitch === 'disabled'}
        onClose={onClose}
        onOpen={onOpen}
        open={open}
        pressed={menuSwitch === 'allon'}
      >
        <ItemizationIcon />
      </DropdownMenuButton>
      <DropdownMenuList open={open}>
        <DropdownMenuListItem
          data-selectid={ItemizationMenuConstants.items.indent.selectId}
          onClick={onIndentItemClick}
        >
          {indentLabel}
        </DropdownMenuListItem>
        <DropdownMenuListItem
          data-selectid={ItemizationMenuConstants.items.outdent.selectId}
          disabled={menuSwitch === 'alloff'}
          onClick={onOutdentItemClick}
        >
          {outdentLabel}
        </DropdownMenuListItem>
      </DropdownMenuList>
    </DropdownMenu>
  );
};
