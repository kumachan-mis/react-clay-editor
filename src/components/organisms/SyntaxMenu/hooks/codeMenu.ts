import { BlockNode } from '../../../../parser/block/types';
import { LineNode } from '../../../../parser/line/types';
import { CodeMenuConstants, CodeMenuProps } from '../../../molecules/menu/CodeMenu';
import {
  CodeMenuHandlerProps,
  handleOnBlockCodeItemClick,
  handleOnCodeButtonClick,
  handleOnInlineCodeItemClick,
} from '../callbacks/code';
import { blockCodeMenuSwitch, inlineCodeMenuSwitch } from '../switches/code';
import { CodeProps } from '../types';

import { BlockPosition } from './blockPosition';
import { ContentPosition } from './contentPosition';
import { CommonMenuProps } from './types';

const defaultHandlerProps: CodeMenuHandlerProps = {
  inlineLabel: CodeMenuConstants.items.inline.defaultLabel,
  blockLabel: CodeMenuConstants.items.block.defaultLabel,
};

export function useCodeMenu(
  lineNodes: LineNode[],
  nodes: (LineNode | BlockNode)[],
  contentPosition: ContentPosition | undefined,
  blockPosition: BlockPosition | undefined,
  codeProps: CodeProps | undefined,
  { text, state, onChangeText, setState, syntax }: CommonMenuProps
): CodeMenuProps {
  const inlineMenuSwitch = codeProps?.disabled ? 'disabled' : inlineCodeMenuSwitch(lineNodes, contentPosition);
  const blockMenuSwitch = codeProps?.disabled ? 'disabled' : blockCodeMenuSwitch(nodes, blockPosition, state);
  const handlerProps: CodeMenuHandlerProps = { syntax, ...defaultHandlerProps, ...codeProps };
  const { inlineLabel, blockLabel } = handlerProps;

  const onButtonClick = () => {
    const [newText, newState] = handleOnCodeButtonClick(
      text,
      lineNodes,
      nodes,
      contentPosition,
      blockPosition,
      state,
      handlerProps,
      inlineMenuSwitch,
      blockMenuSwitch
    );
    onChangeText(newText);
    setState(newState);
  };

  const onInlineItemClick = () => {
    const [newText, newState] = handleOnInlineCodeItemClick(text, lineNodes, contentPosition, state, inlineMenuSwitch);
    onChangeText(newText);
    setState(newState);
  };

  const onBlockItemClick = () => {
    const [newText, newState] = handleOnBlockCodeItemClick(
      text,
      nodes,
      blockPosition,
      state,
      handlerProps,
      blockMenuSwitch
    );
    onChangeText(newText);
    setState(newState);
  };

  return {
    inlineMenuSwitch,
    blockMenuSwitch,
    inlineLabel,
    blockLabel,
    onButtonClick,
    onInlineItemClick,
    onBlockItemClick,
  };
}
