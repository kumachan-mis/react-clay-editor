import React from 'react';

import { CodeLabels, CodeParsing } from '../../../../common/types';
import { createTestId } from '../../../../common/utils';
import { CodeIcon } from '../../../../icons/CodeIcon';
import { DropdownMenu } from '../../../atoms/menu/DropdownMenu';
import { useDropdownMenu } from '../../../atoms/menu/DropdownMenu/hooks';
import { DropdownMenuButton } from '../../../atoms/menu/DropdownMenuButton';
import { DropdownMenuList } from '../../../atoms/menu/DropdownMenuList';
import { DropdownMenuListItem } from '../../../atoms/menu/DropdownMenuListItem';
import {
  CodeMenuHandlerProps,
  handleOnBlockCodeItemClick,
  handleOnCodeButtonClick,
  handleOnInlineCodeItemClick,
} from '../callbacks/code';
import { BlockMenuProps, CommonMenuProps, ContentMenuProps } from '../common/type';
import { blockCodeMenuSwitch, inlineCodeMenuSwitch } from '../switches/code';

export type CodeMenuProps = CodeLabels & CodeParsing & ContentMenuProps & BlockMenuProps & CommonMenuProps;

export const CodeMenuConstants = {
  testId: 'code-menu',
  items: {
    inline: {
      defaultLabel: 'inline code',
      testId: 'inline-code-menu-item',
    },
    block: {
      defaultLabel: 'block code',
      testId: 'block-code-menu-item',
    },
  },
};

export const CodeMenu: React.FC<CodeMenuProps> = ({
  syntax,
  text,
  lineNodes,
  nodes,
  contentPosition,
  blockPosition,
  state,
  setTextAndState,
  disabled,
  inlineLabel = CodeMenuConstants.items.inline.defaultLabel,
  blockLabel = CodeMenuConstants.items.block.defaultLabel,
}) => {
  const [open, anchorEl, onOpen, onClose] = useDropdownMenu();
  const props: CodeMenuHandlerProps = { syntax, inlineLabel, blockLabel };
  const inlineMenuSwitch = inlineCodeMenuSwitch(lineNodes, contentPosition);
  const blockMenuSwitch = blockCodeMenuSwitch(nodes, blockPosition, state);

  return (
    <DropdownMenu>
      <DropdownMenuButton
        open={open}
        onOpen={onOpen}
        onClose={onClose}
        pressed={inlineMenuSwitch === 'on' || blockMenuSwitch === 'on'}
        disabled={disabled || (inlineMenuSwitch === 'disabled' && blockMenuSwitch === 'disabled')}
        buttonProps={{
          onClick: () =>
            setTextAndState(
              ...handleOnCodeButtonClick(
                text,
                lineNodes,
                nodes,
                contentPosition,
                blockPosition,
                state,
                props,
                inlineMenuSwitch,
                blockMenuSwitch
              )
            ),
        }}
        data-testid={createTestId(CodeMenuConstants.testId)}
      >
        <CodeIcon />
      </DropdownMenuButton>
      <DropdownMenuList open={open} anchorEl={anchorEl}>
        <DropdownMenuListItem
          selected={inlineMenuSwitch === 'on'}
          disabled={inlineMenuSwitch === 'disabled'}
          onClick={() =>
            setTextAndState(...handleOnInlineCodeItemClick(text, lineNodes, contentPosition, state, inlineMenuSwitch))
          }
          data-testid={createTestId(CodeMenuConstants.items.inline.testId)}
        >
          {inlineLabel}
        </DropdownMenuListItem>
        <DropdownMenuListItem
          selected={blockMenuSwitch === 'on'}
          disabled={blockMenuSwitch === 'disabled'}
          onClick={() =>
            setTextAndState(...handleOnBlockCodeItemClick(text, nodes, blockPosition, state, props, blockMenuSwitch))
          }
          data-testid={createTestId(CodeMenuConstants.items.block.testId)}
        >
          {blockLabel}
        </DropdownMenuListItem>
      </DropdownMenuList>
    </DropdownMenu>
  );
};
