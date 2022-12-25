import { LinkMenuHandlerProps, handleOnLinkItemClick } from '../callbacks/link';
import { getNestedContentNodeIfNonEndPoint } from '../common/utils';
import { linkMenuSwitch, LinkMenuItem } from '../switches/link';
import { TaggedLinkMenuConstants, TaggedLinkMenuProps } from 'src/components/molecules/menu/TaggedLinkMenu';
import { TaggedLinkProps } from 'src/contexts/EditorPropsContext';
import { LineNode } from 'src/parser/line/types';
import { isPureLineNode } from 'src/parser/line/utils';
import { getTagName } from 'src/parser/taggedLink/utils';

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
  { text, state, setText, setState, syntax }: CommonMenuProps
): TaggedLinkMenuProps {
  const tagEntries = Object.entries(taggedLinkPropsMap || {});

  const menuSwitch = tagEntries.length === 0 ? 'disabled' : linkMenuSwitch(lineNodes, contentPosition, 'taggedLink');
  const activeTagName = getActiveTagName(lineNodes, contentPosition);

  const taggedItemMap: { [tagName: string]: { label: string; onItemClick: () => void } } = {};

  for (const [tagName, taggedLinkProps] of tagEntries) {
    const handlerProps: LinkMenuHandlerProps = { ...defaultLinkProps, ...taggedLinkProps, syntax };
    const menuItem: LinkMenuItem = { type: 'taggedLink', tag: tagName };
    const { label } = handlerProps;
    const onItemClick = () => {
      const [newText, newState] = handleOnLinkItemClick(
        text,
        lineNodes,
        contentPosition,
        state,
        handlerProps,
        menuItem,
        menuSwitch
      );
      setText(newText);
      setState(newState);
    };
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
