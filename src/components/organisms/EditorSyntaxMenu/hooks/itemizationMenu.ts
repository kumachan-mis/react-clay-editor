import { EditorItemizationProps } from '../../../../contexts/EditorPropsContext';
import { LineNode } from '../../../../parser/line/types';
import { ItemizationMenuConstants, ItemizationMenuProps } from '../../../molecules/menu/ItemizationMenu';
import {
  handleOnItemizationButtonClick,
  handleOnItemizationItemClick,
  ItemizationMenuHandlerProps,
} from '../callbacks/itemization';
import { itemizationMenuSwitch } from '../switches/itemization';

import { CommonMenuProps } from './types';

const defaultHandlerProps: ItemizationMenuHandlerProps = {
  indentLabel: ItemizationMenuConstants.items.indent.defaultLabel,
  outdentLabel: ItemizationMenuConstants.items.outdent.defaultLabel,
};

export function useItemizationMenu(
  lineNodes: LineNode[],
  itemizationProps: EditorItemizationProps | undefined,
  { text, state, setText, setState, syntax }: CommonMenuProps
): ItemizationMenuProps {
  const menuSwitch = itemizationMenuSwitch(syntax, lineNodes, state);
  const handlerProps: ItemizationMenuHandlerProps = { ...defaultHandlerProps, ...itemizationProps, syntax };
  const { indentLabel, outdentLabel } = handlerProps;

  const onButtonClick = () => {
    const [newText, newState] = handleOnItemizationButtonClick(text, lineNodes, state, handlerProps, menuSwitch);
    setText(newText);
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
    setText(newText);
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
    setText(newText);
    setState(newState);
  };

  return { menuSwitch, indentLabel, outdentLabel, onButtonClick, onIndentItemClick, onOutdentItemClick };
}
