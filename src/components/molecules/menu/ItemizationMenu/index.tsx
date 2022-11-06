import React from 'react';

import { ItemizationLabels } from '../../../../common/types';
import { createTestId } from '../../../../common/utils';
import { ItemizationIcon } from '../../../../icons/Itemization';
import { DropdownMenu } from '../../../atoms/menu/DropdownMenu';
import { useDropdownMenu } from '../../../atoms/menu/DropdownMenu/hooks';
import { DropdownMenuButton } from '../../../atoms/menu/DropdownMenuButton';
import { DropdownMenuList } from '../../../atoms/menu/DropdownMenuList';
import { DropdownMenuListItem } from '../../../atoms/menu/DropdownMenuListItem';
import {
  handleOnItemizationButtonClick,
  handleOnItemizationItemClick,
  ItemizationMenuHandlerProps,
} from '../callbacks/itemization';
import { CommonMenuProps, LineMenuProps } from '../common/type';
import { itemizationMenuSwitch } from '../switches/itemization';

export type ItemizationMenuProps = ItemizationLabels & LineMenuProps & CommonMenuProps;

export const ItemizationMenuConstants = {
  testId: 'itemization-menu',
  items: {
    indent: {
      defaultLabel: 'indent',
      testId: 'indent-itemization-menu-item',
    },
    outdent: {
      defaultLabel: 'outdent',
      testId: 'outdent-itemization-menu-item',
    },
  },
};

export const ItemizationMenu: React.FC<ItemizationMenuProps> = ({
  syntax,
  text,
  lineNodes: nodes,
  state,
  setTextAndState,
  indentLabel = ItemizationMenuConstants.items.indent.defaultLabel,
  outdentLabel = ItemizationMenuConstants.items.outdent.defaultLabel,
}) => {
  const [open, anchorEl, onOpen, onClose] = useDropdownMenu();
  const menuSwitch = itemizationMenuSwitch(syntax, nodes, state);
  const props: ItemizationMenuHandlerProps = { syntax, indentLabel, outdentLabel };

  return (
    <DropdownMenu>
      <DropdownMenuButton
        open={open}
        onOpen={onOpen}
        onClose={onClose}
        pressed={menuSwitch === 'allon'}
        disabled={menuSwitch === 'disabled'}
        buttonProps={{
          onClick: () => setTextAndState(...handleOnItemizationButtonClick(text, nodes, state, props, menuSwitch)),
        }}
        data-testid={createTestId(ItemizationMenuConstants.testId)}
      >
        <ItemizationIcon />
      </DropdownMenuButton>
      <DropdownMenuList open={open} anchorEl={anchorEl}>
        <DropdownMenuListItem
          onClick={() =>
            setTextAndState(...handleOnItemizationItemClick(text, nodes, state, props, 'indent', menuSwitch))
          }
          data-testid={createTestId(ItemizationMenuConstants.items.indent.testId)}
        >
          {indentLabel}
        </DropdownMenuListItem>
        <DropdownMenuListItem
          disabled={menuSwitch === 'alloff'}
          onClick={() =>
            setTextAndState(...handleOnItemizationItemClick(text, nodes, state, props, 'outdent', menuSwitch))
          }
          data-testid={createTestId(ItemizationMenuConstants.items.outdent.testId)}
        >
          {outdentLabel}
        </DropdownMenuListItem>
      </DropdownMenuList>
    </DropdownMenu>
  );
};
