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
  { text, state, onChangeText, setState, syntax }: CommonMenuProps
): ItemizationMenuProps {
  const menuSwitch = itemizationMenuSwitch(syntax, lineNodes, state);
  const handlerProps: ItemizationMenuHandlerProps = { ...defaultHandlerProps, ...itemizationProps, syntax };
  const { indentLabel, outdentLabel } = handlerProps;

  const onButtonClick = () => {
    const [newText, newState] = handleOnItemizationButtonClick(text, lineNodes, state, handlerProps, menuSwitch);
    onChangeText(newText);
    setState(newState);
  };

  const onIndentItemClick = () => {
    const [newText, newState] = handleOnItemizationItemClick(
      text,
      lineNodes,
      state,
      handlerProps,
      'indent',
      menuSwitch
    );
    onChangeText(newText);
    setState(newState);
  };

  const onOutdentItemClick = () => {
    const [newText, newState] = handleOnItemizationItemClick(
      text,
      lineNodes,
      state,
      handlerProps,
      'outdent',
      menuSwitch
    );
    onChangeText(newText);
    setState(newState);
  };

  return { menuSwitch, indentLabel, outdentLabel, onButtonClick, onIndentItemClick, onOutdentItemClick };
}
