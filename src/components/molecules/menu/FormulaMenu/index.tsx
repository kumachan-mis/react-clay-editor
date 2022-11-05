import React from 'react';

import { FormulaLabels, FormulaParsing } from '../../../../common/types';
import { createTestId } from '../../../../common/utils';
import { FormulaIcon } from '../../../../icons/FormulaIcon';
import { DropdownMenu } from '../../../atoms/menu/DropdownMenu';
import { useDropdownMenu } from '../../../atoms/menu/DropdownMenu/hooks';
import { DropdownMenuButton } from '../../../atoms/menu/DropdownMenuButton';
import { DropdownMenuList } from '../../../atoms/menu/DropdownMenuList';
import { DropdownMenuListItem } from '../../../atoms/menu/DropdownMenuListItem';
import {
  FormulaMenuHandlerProps,
  handleOnBlockFormulaItemClick,
  handleOnContentFormulaItemClick,
  handleOnFormulaButtonClick,
} from '../callbacks/formula';
import { BlockMenuProps, CommonMenuProps, ContentMenuProps } from '../common/type';
import { blockFormulaMenuSwitch, contentFormulaMenuSwitch } from '../switches/formula';

export type FormulaMenuProps = FormulaLabels & FormulaParsing & ContentMenuProps & BlockMenuProps & CommonMenuProps;

export const FormulaMenuConstants = {
  testId: 'formula-menu',
  items: {
    inline: {
      defaultLabel: 'inline formula',
      testId: 'inline-formula-menu-item',
    },
    display: {
      defaultLabel: 'display formula',
      testId: 'display-formula-menu-item',
    },
    block: {
      defaultLabel: 'block formula',
      testId: 'block-formula-menu-item',
    },
  },
};

export const FormulaMenu: React.FC<FormulaMenuProps> = ({
  syntax,
  text,
  lineNodes,
  nodes,
  contentPosition,
  blockPosition,
  state,
  setTextAndState,
  disabled,
  inlineLabel = FormulaMenuConstants.items.inline.defaultLabel,
  displayLabel = FormulaMenuConstants.items.display.defaultLabel,
  blockLabel = FormulaMenuConstants.items.block.defaultLabel,
}) => {
  const [open, anchorEl, onOpen, onClose] = useDropdownMenu();
  const props: FormulaMenuHandlerProps = { syntax, inlineLabel, displayLabel, blockLabel };
  const contentMenuSwitch = contentFormulaMenuSwitch(lineNodes, contentPosition);
  const blockMenuSwitch = blockFormulaMenuSwitch(nodes, blockPosition, state);

  return (
    <DropdownMenu>
      <DropdownMenuButton
        open={open}
        onOpen={onOpen}
        onClose={onClose}
        pressed={contentMenuSwitch === 'inline' || contentMenuSwitch === 'display' || blockMenuSwitch === 'on'}
        disabled={disabled || (contentMenuSwitch === 'disabled' && blockMenuSwitch === 'disabled')}
        buttonProps={{
          onClick: () =>
            setTextAndState(
              ...handleOnFormulaButtonClick(
                text,
                lineNodes,
                nodes,
                contentPosition,
                blockPosition,
                state,
                props,
                contentMenuSwitch,
                blockMenuSwitch
              )
            ),
        }}
        data-testid={createTestId(FormulaMenuConstants.testId)}
      >
        <FormulaIcon />
      </DropdownMenuButton>
      <DropdownMenuList open={open} anchorEl={anchorEl}>
        <DropdownMenuListItem
          selected={contentMenuSwitch === 'inline'}
          disabled={contentMenuSwitch === 'disabled'}
          onClick={() =>
            setTextAndState(
              ...handleOnContentFormulaItemClick(text, lineNodes, contentPosition, state, 'inline', contentMenuSwitch)
            )
          }
          data-testid={createTestId(FormulaMenuConstants.items.inline.testId)}
        >
          {inlineLabel}
        </DropdownMenuListItem>
        <DropdownMenuListItem
          selected={contentMenuSwitch === 'display'}
          disabled={contentMenuSwitch === 'disabled'}
          onClick={() =>
            setTextAndState(
              ...handleOnContentFormulaItemClick(text, lineNodes, contentPosition, state, 'display', contentMenuSwitch)
            )
          }
          data-testid={createTestId(FormulaMenuConstants.items.display.testId)}
        >
          {displayLabel}
        </DropdownMenuListItem>
        <DropdownMenuListItem
          selected={blockMenuSwitch === 'on'}
          disabled={blockMenuSwitch === 'disabled'}
          onClick={() =>
            setTextAndState(...handleOnBlockFormulaItemClick(text, nodes, blockPosition, state, props, blockMenuSwitch))
          }
          data-testid={createTestId(FormulaMenuConstants.items.block.testId)}
        >
          {blockLabel}
        </DropdownMenuListItem>
      </DropdownMenuList>
    </DropdownMenu>
  );
};
