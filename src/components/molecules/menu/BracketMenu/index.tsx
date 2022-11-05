import React from 'react';

import { BracketLabels, BracketLinkParsing, Suggestion } from '../../../../common/types';
import { createTestId } from '../../../../common/utils';
import { BracketIcon } from '../../../../icons/BracketIcon';
import { IconButtonMenu } from '../../../atoms/menu/IconButtonMenu';
import { handleOnLinkItemClick, LinkMenuHandlerProps } from '../callbacks/link';
import { CommonMenuProps, ContentMenuProps } from '../common/type';
import { LinkMenuItem, linkMenuSwitch } from '../switches/link';

export type BracketMenuProps = BracketLabels & BracketLinkParsing & Suggestion & CommonMenuProps & ContentMenuProps;

export const BracketMenuConstants = {
  testId: 'bracket-menu',
  defaultLabel: 'bracket link',
};

export const BracketMenu: React.FC<BracketMenuProps> = ({
  syntax,
  text,
  lineNodes: nodes,
  contentPosition,
  state,
  setTextAndState,
  disabled,
  suggestions = [],
  initialSuggestionIndex = 0,
  label = BracketMenuConstants.defaultLabel,
}) => {
  const props: LinkMenuHandlerProps = { syntax, label, suggestions, initialSuggestionIndex };
  const menuItem: LinkMenuItem = { type: 'bracketLink' };
  const menuSwitch = linkMenuSwitch(nodes, contentPosition, 'bracketLink');

  return (
    <IconButtonMenu
      pressed={menuSwitch === 'on'}
      disabled={disabled || menuSwitch === 'disabled'}
      onClick={() =>
        setTextAndState(...handleOnLinkItemClick(text, nodes, contentPosition, state, props, menuItem, menuSwitch))
      }
      data-testid={createTestId(BracketMenuConstants.testId)}
    >
      <BracketIcon />
    </IconButtonMenu>
  );
};
