import React from 'react';

import { Suggestion, TaggedLinkLabels } from '../../../../common/types';
import { createTestId } from '../../../../common/utils';
import { TaggedlinkIcon } from '../../../../icons/TaggedlinkIcon';
import { DropdownMenu } from '../../../atoms/menu/DropdownMenu';
import { useDropdownMenu } from '../../../atoms/menu/DropdownMenu/hooks';
import { DropdownMenuButton } from '../../../atoms/menu/DropdownMenuButton';
import { DropdownMenuList } from '../../../atoms/menu/DropdownMenuList';
import { DropdownMenuListItem } from '../../../atoms/menu/DropdownMenuListItem';
import { handleOnLinkItemClick, LinkMenuHandlerProps } from '../callbacks/link';
import { CommonMenuProps, ContentMenuProps } from '../common/type';
import { linkMenuSwitch, LinkMenuItem } from '../switches/link';

import { getTagNameAtPosition } from './utils';

export type TaggedLinkMenuProps = {
  tags?: { [tagName: string]: TaggedLinkLabels & Suggestion };
} & ContentMenuProps &
  CommonMenuProps;

export const TaggedLinkMenuConstants = {
  testId: 'tagged-link-menu',
  items: {
    defaultLabel: 'tagged link',
    taggedLabel: (tagName: string, label: string) => `${tagName}: ${label}`,
    testId: (tagName: string) => `${tagName}-tagged-link-menu-item`,
  },
};

export const TaggedLinkMenu: React.FC<TaggedLinkMenuProps> = ({
  tags,
  syntax,
  text,
  lineNodes: nodes,
  contentPosition,
  state,
  setTextAndState,
}) => {
  const [open, anchorEl, onOpen, onClose] = useDropdownMenu();
  const tagEntries = Object.entries(tags || {});
  const menuSwitch = linkMenuSwitch(nodes, contentPosition, 'taggedLink');
  const tagNameOrUndefined = getTagNameAtPosition(nodes, contentPosition);

  const defaultLinkProps = {
    label: TaggedLinkMenuConstants.items.defaultLabel,
    suggestions: [],
    initialSuggestionIndex: 0,
  };

  let handleOnButtonClick = undefined;
  if (tags && tagEntries.length > 0) {
    const [tagName, linkProps] = tagNameOrUndefined ? [tagNameOrUndefined, tags[tagNameOrUndefined]] : tagEntries[0];
    const props: LinkMenuHandlerProps = { syntax, ...defaultLinkProps, ...linkProps };
    const menuItem: LinkMenuItem = { type: 'taggedLink', tag: tagName };
    handleOnButtonClick = () =>
      setTextAndState(...handleOnLinkItemClick(text, nodes, contentPosition, state, props, menuItem, menuSwitch));
  }

  return (
    <DropdownMenu>
      <DropdownMenuButton
        open={open}
        onOpen={onOpen}
        onClose={onClose}
        pressed={menuSwitch === 'on'}
        disabled={tagEntries.length === 0 || menuSwitch === 'disabled'}
        buttonProps={{ onClick: handleOnButtonClick }}
        data-testid={createTestId(TaggedLinkMenuConstants.testId)}
      >
        <TaggedlinkIcon />
      </DropdownMenuButton>
      <DropdownMenuList open={open} anchorEl={anchorEl}>
        {tagEntries.map(
          ([
            tagName,
            { label = TaggedLinkMenuConstants.items.defaultLabel, suggestions = [], initialSuggestionIndex = 0 },
          ]) => {
            const props: LinkMenuHandlerProps = { syntax, label, suggestions, initialSuggestionIndex };
            const menuItem = { type: 'taggedLink', tag: tagName } as const;
            return (
              <DropdownMenuListItem
                key={tagName}
                selected={tagNameOrUndefined === tagName}
                onClick={() =>
                  setTextAndState(
                    ...handleOnLinkItemClick(text, nodes, contentPosition, state, props, menuItem, menuSwitch)
                  )
                }
                data-testid={createTestId(TaggedLinkMenuConstants.items.testId(tagName))}
              >
                {TaggedLinkMenuConstants.items.taggedLabel(tagName, label)}
              </DropdownMenuListItem>
            );
          }
        )}
      </DropdownMenuList>
    </DropdownMenu>
  );
};
