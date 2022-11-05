import { State } from '../../../../Editor/types';
import { BracketLabels, HashtagLabels, Suggestion, TaggedLinkLabels } from '../../../../common/types';
import { LineNode, PureLineNode } from '../../../../parser/types';
import { isPureLineNode, getTagName } from '../../../../parser/utils';
import { getNestedContentNodeIfNonEndPoint } from '../common/utils';
import { ContentPosition, ContentPositionEmpty } from '../hooks/types';
import { LinkMenuItem, LinkMenuSwitch } from '../switches/link';

import {
  insertContentAtCursor,
  replaceContentAtCursor,
  createContentByTextSelection,
  ContentMenuConfig,
} from './common/content';

export type LinkMenuHandlerProps = {
  syntax?: 'bracket' | 'markdown';
} & Required<BracketLabels & TaggedLinkLabels & HashtagLabels> &
  Required<Suggestion>;

export function handleOnLinkItemClick(
  text: string,
  nodes: LineNode[],
  contentPosition: ContentPosition | undefined,
  state: State,
  props: LinkMenuHandlerProps,
  menuItem: LinkMenuItem,
  menuSwitch: LinkMenuSwitch
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
      return replaceContentAtCursor(text, nodes, contentPosition, state, config, onContent);
    }
    const normalConfig = { facingMeta: '', trailingMeta: '', nestedSearch: config.nestedSearch };
    return hideSuggestion(replaceContentAtCursor(text, nodes, contentPosition, state, normalConfig, onContent));
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
      return replaceContentAtCursor(text, nodes, contentPosition, state, config, onContent);
    }
    const normalConfig = { facingMeta: '', trailingMeta: '', nestedSearch: config.nestedSearch };
    return hideSuggestion(replaceContentAtCursor(text, nodes, contentPosition, state, normalConfig, onContent));
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

  if (contentPosition.type === 'empty') {
    return showSuggestion(insertContentAtCursor(text, nodes, state, config, offContent));
  }

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

function getLinkMeta(props: LinkMenuHandlerProps, menuItem: LinkMenuItem): [ContentMenuConfig, number] {
  switch (menuItem.type) {
    case 'bracketLink':
      return [{ facingMeta: '[', content: props.label, trailingMeta: ']', nestedSearch: true }, 0];
    case 'taggedLink':
      return [{ facingMeta: `[${menuItem.tag}: `, content: props.label, trailingMeta: ']', nestedSearch: true }, 1];
    case 'hashtag':
      return [{ facingMeta: '#', content: props.label, trailingMeta: '', nestedSearch: true }, 0];
  }
}
