import { FormulaIcon } from '../../../../icons/FormulaIcon';
import { DropdownMenu } from '../../../atoms/menu/DropdownMenu';
import { useDropdownMenu } from '../../../atoms/menu/DropdownMenu/hooks';
import { DropdownMenuButton } from '../../../atoms/menu/DropdownMenuButton';
import { DropdownMenuList } from '../../../atoms/menu/DropdownMenuList';
import { DropdownMenuListItem } from '../../../atoms/menu/DropdownMenuListItem';

export type FormulaMenuProps = {
  readonly contentMenuSwitch: 'inline' | 'display' | 'off' | 'disabled';
  readonly blockMenuSwitch: 'on' | 'off' | 'disabled';
  readonly inlineLabel: string;
  readonly displayLabel: string;
  readonly blockLabel: string;
  readonly onButtonClick: () => void;
  readonly onInlineItemClick: () => void;
  readonly onDisplayItemClick: () => void;
  readonly onBlockItemClick: () => void;
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
        buttonProps={{ onClick: onButtonClick }}
        disabled={contentMenuSwitch === 'disabled' && blockMenuSwitch === 'disabled'}
        onClose={onClose}
        onOpen={onOpen}
        open={open}
        pressed={contentMenuSwitch === 'inline' || contentMenuSwitch === 'display' || blockMenuSwitch === 'on'}
      >
        <FormulaIcon />
      </DropdownMenuButton>
      <DropdownMenuList open={open}>
        <DropdownMenuListItem
          data-selectid={FormulaMenuConstants.items.inline.selectId}
          disabled={contentMenuSwitch === 'disabled'}
          onClick={onInlineItemClick}
          selected={contentMenuSwitch === 'inline'}
        >
          {inlineLabel}
        </DropdownMenuListItem>
        <DropdownMenuListItem
          data-selectid={FormulaMenuConstants.items.display.selectId}
          disabled={contentMenuSwitch === 'disabled'}
          onClick={onDisplayItemClick}
          selected={contentMenuSwitch === 'display'}
        >
          {displayLabel}
        </DropdownMenuListItem>
        <DropdownMenuListItem
          data-selectid={FormulaMenuConstants.items.block.selectId}
          disabled={blockMenuSwitch === 'disabled'}
          onClick={onBlockItemClick}
          selected={blockMenuSwitch === 'on'}
        >
          {blockLabel}
        </DropdownMenuListItem>
      </DropdownMenuList>
    </DropdownMenu>
  );
};
