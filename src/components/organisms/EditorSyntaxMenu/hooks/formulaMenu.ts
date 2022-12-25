import {
  FormulaMenuHandlerProps,
  handleOnBlockFormulaItemClick,
  handleOnContentFormulaItemClick,
  handleOnFormulaButtonClick,
} from '../callbacks/formula';
import { contentFormulaMenuSwitch, blockFormulaMenuSwitch } from '../switches/formula';
import { FormulaMenuConstants, FormulaMenuProps } from 'src/components/molecules/menu/FormulaMenu';
import { FormulaProps } from 'src/contexts/EditorPropsContext';
import { BlockNode } from 'src/parser/block/types';
import { LineNode } from 'src/parser/line/types';

import { BlockPosition } from './blockPosition';
import { ContentPosition } from './contentPosition';
import { CommonMenuProps } from './types';

const defaultHandlerProps: FormulaMenuHandlerProps = {
  inlineLabel: FormulaMenuConstants.items.inline.defaultLabel,
  displayLabel: FormulaMenuConstants.items.display.defaultLabel,
  blockLabel: FormulaMenuConstants.items.block.defaultLabel,
};

export function useFormulaMenu(
  lineNodes: LineNode[],
  nodes: (LineNode | BlockNode)[],
  contentPosition: ContentPosition | undefined,
  blockPosition: BlockPosition | undefined,
  formulaProps: FormulaProps | undefined,
  { text, state, setText, setState, syntax }: CommonMenuProps
): FormulaMenuProps {
  const contentMenuSwitch = formulaProps?.disabled ? 'disabled' : contentFormulaMenuSwitch(lineNodes, contentPosition);
  const blockMenuSwitch = formulaProps?.disabled ? 'disabled' : blockFormulaMenuSwitch(nodes, blockPosition, state);
  const handlerProps: FormulaMenuHandlerProps = { ...defaultHandlerProps, ...formulaProps, syntax };
  const { inlineLabel, displayLabel, blockLabel } = handlerProps;

  const onButtonClick = () => {
    const [newText, newState] = handleOnFormulaButtonClick(
      text,
      lineNodes,
      nodes,
      contentPosition,
      blockPosition,
      state,
      handlerProps,
      contentMenuSwitch,
      blockMenuSwitch
    );
    setText(newText);
    setState(newState);
  };

  const onInlineItemClick = () => {
    const [newText, newState] = handleOnContentFormulaItemClick(
      text,
      lineNodes,
      contentPosition,
      state,
      'inline',
      contentMenuSwitch
    );
    setText(newText);
    setState(newState);
  };

  const onDisplayItemClick = () => {
    const [newText, newState] = handleOnContentFormulaItemClick(
      text,
      lineNodes,
      contentPosition,
      state,
      'display',
      contentMenuSwitch
    );
    setText(newText);
    setState(newState);
  };

  const onBlockItemClick = () => {
    const [newText, newState] = handleOnBlockFormulaItemClick(
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
    contentMenuSwitch,
    blockMenuSwitch,
    inlineLabel,
    displayLabel,
    blockLabel,
    onButtonClick,
    onInlineItemClick,
    onDisplayItemClick,
    onBlockItemClick,
  };
}
