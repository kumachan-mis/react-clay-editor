import React from 'react';

import { TextLabels } from '../../../../common/types';
import { createTestId } from '../../../../common/utils';
import { SectionIcon } from '../../../../icons/Section';
import { DropdownMenu } from '../../../atoms/menu/DropdownMenu';
import { useDropdownMenu } from '../../../atoms/menu/DropdownMenu/hooks';
import { DropdownMenuButton } from '../../../atoms/menu/DropdownMenuButton';
import { DropdownMenuList } from '../../../atoms/menu/DropdownMenuList';
import { DropdownMenuListItem } from '../../../atoms/menu/DropdownMenuListItem';
import {
  handleOnSectionButtonClick,
  handleOnSectionItemClick,
  SectionMenuHandlerProps,
} from '../../../organisms/SyntaxMenu/callbacks/section';
import { CommonMenuProps, LineMenuProps } from '../../../organisms/SyntaxMenu/common/type';
import { sectionMenuSwitch } from '../../../organisms/SyntaxMenu/switches/section';

export type SectionMenuProps = TextLabels & LineMenuProps & CommonMenuProps;

export const SectionMenuConstants = {
  testId: 'section-menu',
  items: {
    normal: {
      defaultLabel: 'normal',
      testId: 'normal-section-menu-item',
    },
    larger: {
      defaultLabel: 'larger',
      testId: 'larger-section-menu-item',
    },
    largest: {
      defaultLabel: 'largest',
      testId: 'largest-section-menu-item',
    },
  },
};

export const SectionMenu: React.FC<SectionMenuProps> = ({
  syntax,
  text,
  lineNodes: nodes,
  state,
  setTextAndState,
  normalLabel = SectionMenuConstants.items.normal.defaultLabel,
  largerLabel = SectionMenuConstants.items.larger.defaultLabel,
  largestLabel = SectionMenuConstants.items.largest.defaultLabel,
}) => {
  const [open, anchorEl, onOpen, onClose] = useDropdownMenu();

  const menuSwitch = sectionMenuSwitch(syntax, nodes, state);
  const handlerProps: SectionMenuHandlerProps = { syntax, normalLabel, largerLabel, largestLabel };

  const handleOnButtonClick = () =>
    setTextAndState(...handleOnSectionButtonClick(text, nodes, state, handlerProps, menuSwitch));

  const handleOnNormalItemClick = () =>
    setTextAndState(...handleOnSectionItemClick(text, nodes, state, handlerProps, 'normal', menuSwitch));

  const handleOnLargerItemClick = () =>
    setTextAndState(...handleOnSectionItemClick(text, nodes, state, handlerProps, 'larger', menuSwitch));

  const handleOnLargestItemClick = () =>
    setTextAndState(...handleOnSectionItemClick(text, nodes, state, handlerProps, 'largest', menuSwitch));

  return (
    <DropdownMenu>
      <DropdownMenuButton
        open={open}
        onOpen={onOpen}
        onClose={onClose}
        pressed={menuSwitch !== 'off' && menuSwitch !== 'disabled'}
        disabled={menuSwitch === 'disabled'}
        buttonProps={{ onClick: handleOnButtonClick }}
        data-testid={createTestId(SectionMenuConstants.testId)}
      >
        <SectionIcon />
      </DropdownMenuButton>
      <DropdownMenuList open={open} anchorEl={anchorEl}>
        <DropdownMenuListItem
          selected={menuSwitch === 'normal'}
          onClick={handleOnNormalItemClick}
          data-testid={createTestId(SectionMenuConstants.items.normal.testId)}
        >
          {normalLabel}
        </DropdownMenuListItem>
        <DropdownMenuListItem
          selected={menuSwitch === 'larger'}
          onClick={handleOnLargerItemClick}
          data-testid={createTestId(SectionMenuConstants.items.larger.testId)}
        >
          {largerLabel}
        </DropdownMenuListItem>
        <DropdownMenuListItem
          selected={menuSwitch === 'largest'}
          onClick={handleOnLargestItemClick}
          data-testid={createTestId(SectionMenuConstants.items.largest.testId)}
        >
          {largestLabel}
        </DropdownMenuListItem>
      </DropdownMenuList>
    </DropdownMenu>
  );
};
