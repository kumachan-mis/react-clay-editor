import { LineNode } from '../../../../parser/line/types';
import { ItemizationMenuConstants, ItemizationMenuProps } from '../../../molecules/menu/ItemizationMenu';
import {
  handleOnItemizationButtonClick,
  handleOnItemizationItemClick,
  ItemizationMenuHandlerProps,
} from '../callbacks/itemization';
import { itemizationMenuSwitch } from '../switches/itemization';
import { ItemizationProps } from '../types';

import { CommonMenuProps } from './types';

const defaultHandlerProps: ItemizationMenuHandlerProps = {
  indentLabel: ItemizationMenuConstants.items.indent.defaultLabel,
  outdentLabel: ItemizationMenuConstants.items.outdent.defaultLabel,
};

export function useItemizationMenu(
  lineNodes: LineNode[],
  itemizationProps: ItemizationProps | undefined,
  { text, state, setTextAndState, syntax }: CommonMenuProps
): ItemizationMenuProps {
  const menuSwitch = itemizationMenuSwitch(syntax, lineNodes, state);
  const handlerProps: ItemizationMenuHandlerProps = { ...defaultHandlerProps, ...itemizationProps, syntax };
  const { indentLabel, outdentLabel } = handlerProps;

  const onButtonClick = () =>
    setTextAndState(...handleOnItemizationButtonClick(text, lineNodes, state, handlerProps, menuSwitch));

  const onIndentItemClick = () =>
    setTextAndState(...handleOnItemizationItemClick(text, lineNodes, state, handlerProps, 'indent', menuSwitch));

  const onOutdentItemClick = () =>
    setTextAndState(...handleOnItemizationItemClick(text, lineNodes, state, handlerProps, 'outdent', menuSwitch));

  return { menuSwitch, indentLabel, outdentLabel, onButtonClick, onIndentItemClick, onOutdentItemClick };
}
