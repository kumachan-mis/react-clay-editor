import { BlockNode } from '../../../../parser/block/types';
import { LineNode } from '../../../../parser/line/types';
import { FormulaMenuConstants, FormulaMenuProps } from '../../../molecules/menu/FormulaMenu';
import {
  FormulaMenuHandlerProps,
  handleOnBlockFormulaItemClick,
  handleOnContentFormulaItemClick,
  handleOnFormulaButtonClick,
} from '../callbacks/formula';
import { blockFormulaMenuSwitch, contentFormulaMenuSwitch } from '../switches/formula';
import { FormulaProps } from '../types';

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
  { text, state, setTextAndState, syntax }: CommonMenuProps
): FormulaMenuProps {
  const contentMenuSwitch = formulaProps?.disabled ? 'disabled' : contentFormulaMenuSwitch(lineNodes, contentPosition);
  const blockMenuSwitch = formulaProps?.disabled ? 'disabled' : blockFormulaMenuSwitch(nodes, blockPosition, state);
  const handlerProps: FormulaMenuHandlerProps = { ...defaultHandlerProps, ...formulaProps, syntax };
  const { inlineLabel, displayLabel, blockLabel } = handlerProps;

  const onButtonClick = () =>
    setTextAndState(
      ...handleOnFormulaButtonClick(
        text,
        lineNodes,
        nodes,
        contentPosition,
        blockPosition,
        state,
        handlerProps,
        contentMenuSwitch,
        blockMenuSwitch
      )
    );

  const onInlineItemClick = () =>
    setTextAndState(
      ...handleOnContentFormulaItemClick(text, lineNodes, contentPosition, state, 'inline', contentMenuSwitch)
    );

  const onDisplayItemClick = () =>
    setTextAndState(
      ...handleOnContentFormulaItemClick(text, lineNodes, contentPosition, state, 'display', contentMenuSwitch)
    );

  const onBlockItemClick = () =>
    setTextAndState(...handleOnBlockFormulaItemClick(text, nodes, blockPosition, state, handlerProps, blockMenuSwitch));

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
