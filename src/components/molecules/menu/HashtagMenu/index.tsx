import React from 'react';

import { HashtagLabels, HashtagParsing, Suggestion } from '../../../../common/types';
import { createTestId } from '../../../../common/utils';
import { HashtagIcon } from '../../../../icons/HashtagIcon';
import { IconButtonMenu } from '../../../atoms/menu/IconButtonMenu';
import { handleOnLinkItemClick, LinkMenuHandlerProps } from '../callbacks/link';
import { CommonMenuProps, ContentMenuProps } from '../common/type';
import { LinkMenuItem, linkMenuSwitch } from '../switches/link';

export type HashtagMenuProps = HashtagLabels & HashtagParsing & Suggestion & ContentMenuProps & CommonMenuProps;

export const HashtagMenuConstants = {
  testId: 'hashtag-menu',
  defaultLabel: 'hashtag link',
};

export const HashtagMenu: React.FC<HashtagMenuProps> = ({
  syntax,
  text,
  lineNodes: nodes,
  contentPosition,
  state,
  setTextAndState,
  disabled,
  suggestions = [],
  initialSuggestionIndex = 0,
  label = HashtagMenuConstants.defaultLabel,
}) => {
  const props: LinkMenuHandlerProps = { syntax, label, suggestions, initialSuggestionIndex };
  const menuItem: LinkMenuItem = { type: 'hashtag' };
  const menuSwitch = linkMenuSwitch(nodes, contentPosition, 'hashtag');

  return (
    <IconButtonMenu
      pressed={menuSwitch === 'on'}
      disabled={disabled || menuSwitch === 'disabled'}
      onClick={() =>
        setTextAndState(...handleOnLinkItemClick(text, nodes, contentPosition, state, props, menuItem, menuSwitch))
      }
      data-testid={createTestId(HashtagMenuConstants.testId)}
    >
      <HashtagIcon />
    </IconButtonMenu>
  );
};
