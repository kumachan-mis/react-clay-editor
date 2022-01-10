import { State } from '../../Editor/types';
import { ItemizationNode, LineNode, NormalLineNode, QuotationNode } from '../../parser/types';
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
  if (isEndPoint(contentPosition)) return 'off';

  const contentNode = lineNode.children[contentPosition.contentIndexes[0]];
  if (contentNode.type === menu) return 'on';
  if (contentNode.type === 'normal') return 'off';
  return 'disabled';
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
  const config = getLinkMeta(menuItem);

  function handleItemOffWithoutSelection(
    lineNode: NormalLineNode | ItemizationNode | QuotationNode,
    contentPosition: Exclude<ContentPosition, ContentPositionEmpty>
  ): [string, State] {
    const contentNode = lineNode.children[contentPosition.contentIndexes[0]];
    if (!isEndPoint(contentPosition) && contentNode.type !== 'normal') return [text, state];
    return showSuggestion(insertContentAtCursor(text, nodes, state, config));
  }

  function handleItemOnWithoutSelection(
    lineNode: NormalLineNode | ItemizationNode | QuotationNode,
    contentPosition: Exclude<ContentPosition, ContentPositionEmpty>
  ): [string, State] {
    const contentNode = lineNode.children[contentPosition.contentIndexes[0]];
    if (contentNode.type !== menuItem.type) return [text, state];
    let substitutionConfig = { facingMeta: '', trailingMeta: '' };
    if (menuItem.type === 'taggedLink' && menuItem.tag !== getTagName(contentNode.facingMeta)) {
      substitutionConfig = { facingMeta: config.facingMeta, trailingMeta: config.trailingMeta };
    }
    return substituteContentAtCursor(text, nodes, contentPosition, state, substitutionConfig, onContent);
  }

  function handleItemOffWithSelection(
    lineNode: NormalLineNode | ItemizationNode | QuotationNode,
    contentPosition: Exclude<ContentPosition, ContentPositionEmpty>
  ): [string, State] {
    const contentNode = lineNode.children[contentPosition.contentIndexes[0]];
    if (contentNode.type !== 'normal') return [text, state];
    return createContentByTextSelection(text, nodes, state, config, offContent);
  }

  function handleItemOnWithSelection(
    lineNode: NormalLineNode | ItemizationNode | QuotationNode,
    contentPosition: Exclude<ContentPosition, ContentPositionEmpty>
  ): [string, State] {
    const contentNode = lineNode.children[contentPosition.contentIndexes[0]];
    if (contentNode.type !== menuItem.type) return [text, state];
    let substitutionConfig = { facingMeta: '', trailingMeta: '' };
    if (menuItem.type === 'taggedLink' && menuItem.tag !== getTagName(contentNode.facingMeta)) {
      substitutionConfig = { facingMeta: config.facingMeta, trailingMeta: config.trailingMeta };
    }
    return substituteContentAtCursor(text, nodes, contentPosition, state, substitutionConfig, onContent);
  }

  function showSuggestion([newText, newState]: [string, State]): [string, State] {
    if ((newText === text && newState === state) || props.suggestions.length === 0) return [newText, newState];
    const { suggestions, initialSuggestionIndex: suggestionIndex } = props;
    const { suggestionStart } = config;
    return [newText, { ...newState, suggestionType: menuItem.type, suggestions, suggestionIndex, suggestionStart }];
  }

  if (!state.cursorCoordinate || !contentPosition || menuSwitch === 'disabled') return [text, state];

  if (contentPosition.type === 'empty') return showSuggestion(insertContentAtCursor(text, nodes, state, config));

  const lineNode = nodes[contentPosition.lineIndex];
  if (!isPureLineNode(lineNode)) return [text, state];

  if (!state.textSelection) {
    if (menuSwitch === 'off') {
      return handleItemOffWithoutSelection(lineNode, contentPosition);
    } else {
      return handleItemOnWithoutSelection(lineNode, contentPosition);
    }
  } else {
    if (menuSwitch === 'off') {
      return handleItemOffWithSelection(lineNode, contentPosition);
    } else {
      return handleItemOnWithSelection(lineNode, contentPosition);
    }
  }
}

function getLinkMeta(
  menuItem: { type: 'bracketLink' } | { type: 'taggedLink'; tag: string } | { type: 'hashtag' }
): ContentConfig & { suggestionStart: number } {
  switch (menuItem.type) {
    case 'bracketLink':
      return { facingMeta: '[', content: 'bracket link', trailingMeta: ']', suggestionStart: 0 };
    case 'taggedLink':
      return { facingMeta: `[${menuItem.tag}: `, content: 'tagged link', trailingMeta: ']', suggestionStart: 1 };
    case 'hashtag':
      return { facingMeta: '#', content: 'hashtag_link ', trailingMeta: '', suggestionStart: 0 };
  }
}
