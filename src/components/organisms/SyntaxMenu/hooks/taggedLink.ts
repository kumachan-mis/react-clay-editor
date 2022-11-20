import { LineNode } from '../../../../parser/line/types';
import { isPureLineNode } from '../../../../parser/line/utils';
import { getTagName } from '../../../../parser/taggedLink/utils';
import { TaggedLinkMenuConstants, TaggedLinkMenuProps } from '../../../molecules/menu/TaggedLinkMenu';
import { handleOnLinkItemClick, LinkMenuHandlerProps } from '../callbacks/link';
import { getNestedContentNodeIfNonEndPoint } from '../common/utils';
import { LinkMenuItem, linkMenuSwitch } from '../switches/link';
import { TaggedLinkProps } from '../types';

import { ContentPosition } from './contentPosition';
import { CommonMenuProps } from './types';

const defaultLinkProps: LinkMenuHandlerProps = {
  label: TaggedLinkMenuConstants.items.defaultLabel,
  suggestions: [],
  initialSuggestionIndex: 0,
};

export function useTaggedLinkMenu(
  lineNodes: LineNode[],
  contentPosition: ContentPosition | undefined,
  taggedLinkPropsMap: { [tagName: string]: TaggedLinkProps } | undefined,
  { text, state, setTextAndState, syntax }: CommonMenuProps
): TaggedLinkMenuProps {
  const tagEntries = Object.entries(taggedLinkPropsMap || {});

  const menuSwitch = tagEntries.length === 0 ? 'disabled' : linkMenuSwitch(lineNodes, contentPosition, 'taggedLink');
  const activeTagName = getActiveTagName(lineNodes, contentPosition);

  const taggedItemMap: { [tagName: string]: { label: string; onItemClick: () => void } } = {};

  for (const [tagName, taggedLinkProps] of tagEntries) {
    const handlerProps: LinkMenuHandlerProps = { ...defaultLinkProps, ...taggedLinkProps, syntax };
    const menuItem: LinkMenuItem = { type: 'taggedLink', tag: tagName };
    const { label } = handlerProps;
    const onItemClick = () =>
      setTextAndState(
        ...handleOnLinkItemClick(text, lineNodes, contentPosition, state, handlerProps, menuItem, menuSwitch)
      );
    taggedItemMap[tagName] = { label, onItemClick };
  }

  return { menuSwitch, activeTagName, taggedItemMap };
}

function getActiveTagName(lineNodes: LineNode[], contentPosition: ContentPosition | undefined): string | undefined {
  if (!contentPosition) return undefined;
  const lineNode = lineNodes[contentPosition.lineIndex];
  if (!isPureLineNode(lineNode)) return undefined;
  const contentNode = getNestedContentNodeIfNonEndPoint(lineNode, contentPosition);
  if (!contentNode || contentNode.type !== 'taggedLink') return undefined;
  return getTagName(contentNode);
}
