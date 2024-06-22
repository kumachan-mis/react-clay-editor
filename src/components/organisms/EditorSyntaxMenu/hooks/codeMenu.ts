import { EditorCodeProps } from '../../../../contexts/EditorPropsContext';
import { TopLevelNode } from '../../../../parser';
import { LineNode } from '../../../../parser/line/lineNode';
import { CodeMenuConstants, CodeMenuProps } from '../../../molecules/menu/CodeMenu';
import {
  CodeMenuHandlerProps,
  handleOnBlockCodeItemClick,
  handleOnCodeButtonClick,
  handleOnInlineCodeItemClick,
} from '../callbacks/code';
import { blockCodeMenuSwitch, inlineCodeMenuSwitch } from '../switches/code';

import { BlockPosition } from './blockPosition';
import { ContentPosition } from './contentPosition';
import { CommonMenuProps } from './types';

const defaultHandlerProps: CodeMenuHandlerProps = {
  inlineLabel: CodeMenuConstants.items.inline.defaultLabel,
  blockLabel: CodeMenuConstants.items.block.defaultLabel,
};

export function useCodeMenu(
  lineNodes: LineNode[],
  nodes: TopLevelNode[],
  contentPosition: ContentPosition | undefined,
  blockPosition: BlockPosition | undefined,
  codeProps: EditorCodeProps | undefined,
  { text, state, setText, setState, syntax }: CommonMenuProps
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
    setText(newText);
    setState(newState);
  };

  const onInlineItemClick = () => {
    const [newText, newState] = handleOnInlineCodeItemClick(text, lineNodes, contentPosition, state, inlineMenuSwitch);
    setText(newText);
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
    setText(newText);
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
