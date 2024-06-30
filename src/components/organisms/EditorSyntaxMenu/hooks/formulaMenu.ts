import { EditorFormulaProps } from '../../../../contexts/EditorPropsContext';
import { TopLevelNode } from '../../../../parser';
import { LineNode } from '../../../../parser/line/lineNode';
import { FormulaMenuConstants, FormulaMenuProps } from '../../../molecules/menu/FormulaMenu';
import {
  FormulaMenuHandlerProps,
  handleOnBlockFormulaItemClick,
  handleOnContentFormulaItemClick,
  handleOnFormulaButtonClick,
} from '../callbacks/formula';
import { blockFormulaMenuSwitch, contentFormulaMenuSwitch } from '../switches/formula';

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
  nodes: TopLevelNode[],
  contentPosition: ContentPosition | undefined,
  blockPosition: BlockPosition | undefined,
  formulaProps: EditorFormulaProps | undefined,
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
