import { State } from '../../Editor/types';
import { ContentNode, LineNode, PureLineNode } from '../../parser/types';
import { isPureLineNode, getTagName } from '../../parser/utils';
import {
  insertContentAtCursor,
  substituteContentAtCursor,
  createContentByTextSelection,
} from '../callbacksCommon/content';
import { ContentConfig } from '../callbacksCommon/types';
import { isEndPoint } from '../callbacksCommon/utils';
import {
  BracketMenuProps,
  HashtagMenuProps,
  TaggedLinkMenuProps,
  ContentPosition,
  ContentPositionEmpty,
} from '../types';

import { MenuHandler } from './types';

export function linkMenuSwitch(
  nodes: LineNode[],
  contentPosition: ContentPosition | undefined,
  menu: 'bracketLink' | 'taggedLink' | 'hashtag'
): 'on' | 'off' | 'disabled' {
  if (!contentPosition) return 'disabled';
  const lineNode = nodes[contentPosition.lineIndex];
  if (!isPureLineNode(lineNode)) return 'disabled';
  const contentNode = getNestedContentNodeIfNonEndPoint(lineNode, contentPosition);
  if (!contentNode) return 'off';

  if (contentNode.type === menu) return 'on';
  if (contentNode.type === 'normal') return 'off';
  return 'disabled';
}

export function getTagNameAtPosition(
  nodes: LineNode[],
  contentPosition: ContentPosition | undefined
): string | undefined {
  if (!contentPosition) return undefined;
  const lineNode = nodes[contentPosition.lineIndex];
  if (!isPureLineNode(lineNode)) return undefined;
  const contentNode = getNestedContentNodeIfNonEndPoint(lineNode, contentPosition);
  if (!contentNode || contentNode.type !== 'taggedLink') return undefined;
  return getTagName(contentNode.facingMeta);
}

export function handleOnLinkItemClick(
  text: string,
  nodes: LineNode[],
  contentPosition: ContentPosition | undefined,
  state: State,
  props: MenuHandler<BracketMenuProps | TaggedLinkMenuProps | HashtagMenuProps>,
  menuItem: { type: 'bracketLink' } | { type: 'taggedLink'; tag: string } | { type: 'hashtag' },
  menuSwitch: 'on' | 'off' | 'disabled'
): [string, State] {
  const offContent = (content: string) => (menuItem.type === 'hashtag' ? content.replaceAll(' ', '_') + ' ' : content);
  const onContent = (content: string) => (menuItem.type === 'hashtag' ? content.replaceAll('_', ' ') : content);
  const [config, suggestionStart] = getLinkMeta(props, menuItem);

  function handleItemOffWithoutSelection(): [string, State] {
    return showSuggestion(insertContentAtCursor(text, nodes, state, config, offContent));
  }

  function handleItemOnWithoutSelection(
    lineNode: PureLineNode,
    contentPosition: Exclude<ContentPosition, ContentPositionEmpty>
  ): [string, State] {
    const contentNode = getNestedContentNodeIfNonEndPoint(lineNode, contentPosition);
    if (!contentNode || contentNode.type !== menuItem.type) return [text, state];
    if (menuItem.type === 'taggedLink' && menuItem.tag !== getTagName(contentNode.facingMeta)) {
      return substituteContentAtCursor(text, nodes, contentPosition, state, config, onContent);
    }
    const normalConfig = { facingMeta: '', trailingMeta: '', nestedSearch: config.nestedSearch };
    return hideSuggestion(substituteContentAtCursor(text, nodes, contentPosition, state, normalConfig, onContent));
  }

  function handleItemOffWithSelection(): [string, State] {
    return createContentByTextSelection(text, nodes, state, config, offContent);
  }

  function handleItemOnWithSelection(
    lineNode: PureLineNode,
    contentPosition: Exclude<ContentPosition, ContentPositionEmpty>
  ): [string, State] {
    const contentNode = getNestedContentNodeIfNonEndPoint(lineNode, contentPosition);
    if (!contentNode || contentNode.type !== menuItem.type) return [text, state];
    if (menuItem.type === 'taggedLink' && menuItem.tag !== getTagName(contentNode.facingMeta)) {
      return substituteContentAtCursor(text, nodes, contentPosition, state, config, onContent);
    }
    const normalConfig = { facingMeta: '', trailingMeta: '', nestedSearch: config.nestedSearch };
    return hideSuggestion(substituteContentAtCursor(text, nodes, contentPosition, state, normalConfig, onContent));
  }

  function showSuggestion([newText, newState]: [string, State]): [string, State] {
    if ((newText === text && newState === state) || props.suggestions.length === 0) return [newText, newState];
    const { suggestions, initialSuggestionIndex: suggestionIndex } = props;
    return [newText, { ...newState, suggestionType: menuItem.type, suggestions, suggestionIndex, suggestionStart }];
  }

  function hideSuggestion([newText, newState]: [string, State]): [string, State] {
    return [newText, { ...newState, suggestionType: 'none', suggestions: [], suggestionIndex: -1, suggestionStart: 0 }];
  }

  if (!state.cursorCoordinate || !contentPosition || menuSwitch === 'disabled') return [text, state];

  if (contentPosition.type === 'empty') return showSuggestion(insertContentAtCursor(text, nodes, state, config));

  const lineNode = nodes[contentPosition.lineIndex];
  if (!isPureLineNode(lineNode)) return [text, state];

  if (!state.textSelection) {
    if (menuSwitch === 'off') {
      return handleItemOffWithoutSelection();
    } else {
      return handleItemOnWithoutSelection(lineNode, contentPosition);
    }
  } else {
    if (menuSwitch === 'off') {
      return handleItemOffWithSelection();
    } else {
      return handleItemOnWithSelection(lineNode, contentPosition);
    }
  }
}

function getLinkMeta(
  props: MenuHandler<BracketMenuProps | TaggedLinkMenuProps | HashtagMenuProps>,
  menuItem: { type: 'bracketLink' } | { type: 'taggedLink'; tag: string } | { type: 'hashtag' }
): [ContentConfig, number] {
  switch (menuItem.type) {
    case 'bracketLink':
      return [{ facingMeta: '[', content: props.label, trailingMeta: ']', nestedSearch: true }, 0];
    case 'taggedLink':
      return [{ facingMeta: `[${menuItem.tag}: `, content: props.label, trailingMeta: ']', nestedSearch: true }, 1];
    case 'hashtag':
      return [{ facingMeta: '#', content: props.label, trailingMeta: '', nestedSearch: true }, 0];
  }
}

function getNestedContentNodeIfNonEndPoint(
  lineNode: PureLineNode,
  contentPosition: ContentPosition
): ContentNode | undefined {
  if (isEndPoint(contentPosition)) return undefined;
  const contentNode = lineNode.children[contentPosition.contentIndexes[0]];
  if (contentPosition.type !== 'nested' || contentNode.type !== 'decoration') return contentNode;

  if (isEndPoint(contentPosition.childPosition)) return undefined;
  const childContentNode = contentNode.children[contentPosition.childPosition.contentIndexes[0]];
  return childContentNode;
}
