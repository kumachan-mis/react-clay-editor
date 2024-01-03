import { CodeIcon } from '../../../../icons/CodeIcon';
import { DropdownMenu } from '../../../atoms/menu/DropdownMenu';
import { useDropdownMenu } from '../../../atoms/menu/DropdownMenu/hooks';
import { DropdownMenuButton } from '../../../atoms/menu/DropdownMenuButton';
import { DropdownMenuList } from '../../../atoms/menu/DropdownMenuList';
import { DropdownMenuListItem } from '../../../atoms/menu/DropdownMenuListItem';

export type CodeMenuProps = {
  readonly inlineMenuSwitch: 'on' | 'off' | 'disabled';
  readonly blockMenuSwitch: 'on' | 'off' | 'disabled';
  readonly inlineLabel: string;
  readonly blockLabel: string;
  readonly onButtonClick: () => void;
  readonly onInlineItemClick: () => void;
  readonly onBlockItemClick: () => void;
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
        buttonProps={{ onClick: onButtonClick }}
        disabled={inlineMenuSwitch === 'disabled' && blockMenuSwitch === 'disabled'}
        onClose={onClose}
        onOpen={onOpen}
        open={open}
        pressed={inlineMenuSwitch === 'on' || blockMenuSwitch === 'on'}
      >
        <CodeIcon />
      </DropdownMenuButton>
      <DropdownMenuList open={open}>
        <DropdownMenuListItem
          data-selectid={CodeMenuConstants.items.inline.selectId}
          disabled={inlineMenuSwitch === 'disabled'}
          onClick={onInlineItemClick}
          selected={inlineMenuSwitch === 'on'}
        >
          {inlineLabel}
        </DropdownMenuListItem>
        <DropdownMenuListItem
          data-selectid={CodeMenuConstants.items.block.selectId}
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
