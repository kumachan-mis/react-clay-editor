import { State } from '../../Editor/types';
import { TextSelection } from '../../components/molecules/selection/Selection/types';
import { copySelection } from '../../components/molecules/selection/Selection/utils';
import { DecorationNode, LineNode } from '../../parser/types';
import {
  insertContentAtCursor,
  createContentByTextSelection,
  newCharIndexAfterCreation,
  replaceContentAtCursor,
  newCharIndexAfterReplacement,
} from '../callbacksCommon/content';
import { undefinedIfZeroSelection } from '../callbacksCommon/utils';
import { ContentPosition, SectionMenuProps } from '../types';

import { MenuHandler } from './types';

export function sectionMenuSwitch(
  syntax: 'bracket' | 'markdown' | undefined,
  nodes: LineNode[],
  state: State
): 'off' | 'normal' | 'larger' | 'largest' | 'disabled' {
  if (!state.cursorCoordinate) return 'disabled';

  const { cursorCoordinate, textSelection } = state;
  if (textSelection && textSelection.free.lineIndex !== textSelection.fixed.lineIndex) return 'disabled';

  const lineNode = nodes[cursorCoordinate.lineIndex];
  if (lineNode.type !== 'normalLine') return 'disabled';

  const decorationNodes = lineNode.children.filter((node) => node.type === 'decoration') as DecorationNode[];
  if (decorationNodes.length > 1 || (decorationNodes.length === 1 && lineNode.children.length !== 1)) return 'disabled';

  if (decorationNodes.length === 0) return 'off';

  const decorationNode = decorationNodes[0];
  if ((!syntax || syntax === 'bracket') && !/^\[\*+ $/.test(decorationNode.facingMeta)) return 'disabled';
  else if (syntax === 'markdown' && !/^#+ $/.test(decorationNode.facingMeta)) return 'disabled';

  return decorationNode.decoration.size;
}

export function handleOnSectionButtonClick(
  text: string,
  nodes: LineNode[],
  state: State,
  props: MenuHandler<SectionMenuProps>,
  menuSwitch: 'normal' | 'larger' | 'largest' | 'disabled' | 'off'
): [string, State] {
  if (menuSwitch === 'disabled') return [text, state];

  let menuItem: 'normal' | 'larger' | 'largest' = 'larger';
  if (menuSwitch !== 'off') menuItem = menuSwitch;
  return handleOnSectionItemClick(text, nodes, state, props, menuItem, menuSwitch);
}

export function handleOnSectionItemClick(
  text: string,
  nodes: LineNode[],
  state: State,
  props: MenuHandler<SectionMenuProps>,
  menuItem: 'normal' | 'larger' | 'largest',
  menuSwitch: 'normal' | 'larger' | 'largest' | 'disabled' | 'off'
): [string, State] {
  const { cursorCoordinate, textSelection } = state;
  if (!cursorCoordinate || menuSwitch === 'disabled') return [text, state];
  const lineNode = nodes[cursorCoordinate.lineIndex];
  if (lineNode.type !== 'normalLine') return [text, state];

  const { facingMeta, sectionName, trailingMeta } = getSectionMeta(props, menuItem);
  const line = text.split('\n')[cursorCoordinate.lineIndex];
  if (!line) return insertContentAtCursor(text, nodes, state, { facingMeta, content: sectionName, trailingMeta });

  const lineSelection: TextSelection = {
    fixed: { lineIndex: cursorCoordinate.lineIndex, charIndex: 0 },
    free: { lineIndex: cursorCoordinate.lineIndex, charIndex: line.length },
  };
  const dummyState = { ...state, textSelection: lineSelection };

  if (menuSwitch === 'off') {
    const config = { facingMeta, trailingMeta };
    const [newText, newState] = createContentByTextSelection(text, nodes, dummyState, config);
    const [newCursorCoordinate, newTextSelection] = [{ ...cursorCoordinate }, copySelection(textSelection)];
    const newCharIndex = (charIndex: number) => newCharIndexAfterCreation(charIndex, lineSelection, config);
    newCursorCoordinate.charIndex = newCharIndex(newCursorCoordinate.charIndex);
    if (newTextSelection) {
      newTextSelection.fixed.charIndex = newCharIndex(newTextSelection.fixed.charIndex);
      newTextSelection.free.charIndex = newCharIndex(newTextSelection.free.charIndex);
    }
    return [
      newText,
      { ...newState, cursorCoordinate: newCursorCoordinate, textSelection: undefinedIfZeroSelection(newTextSelection) },
    ];
  }

  const decorationNode = lineNode.children[0];
  if (decorationNode.type === 'decoration') {
    const config = menuSwitch === menuItem ? { facingMeta: '', trailingMeta: '' } : { facingMeta, trailingMeta };
    const position: ContentPosition = { type: 'inner', lineIndex: cursorCoordinate.lineIndex, contentIndexes: [0] };
    const [newText, newState] = replaceContentAtCursor(text, nodes, position, dummyState, config);
    const [newCursorCoordinate, newTextSelection] = [{ ...cursorCoordinate }, copySelection(textSelection)];
    const newCharIndex = (charIndex: number) => newCharIndexAfterReplacement(charIndex, decorationNode, config);
    newCursorCoordinate.charIndex = newCharIndex(newCursorCoordinate.charIndex);
    if (newTextSelection) {
      newTextSelection.fixed.charIndex = newCharIndex(newTextSelection.fixed.charIndex);
      newTextSelection.free.charIndex = newCharIndex(newTextSelection.free.charIndex);
    }
    return [
      newText,
      { ...newState, cursorCoordinate: newCursorCoordinate, textSelection: undefinedIfZeroSelection(newTextSelection) },
    ];
  }

  return [text, state];
}

function getSectionMeta(
  props: MenuHandler<SectionMenuProps>,
  menuItem: 'normal' | 'larger' | 'largest'
): { facingMeta: string; sectionName: string; trailingMeta: string } {
  if (!props.syntax || props.syntax === 'bracket') {
    // bracket syntax
    switch (menuItem) {
      case 'normal':
        return { facingMeta: '[* ', sectionName: props.normalLabel, trailingMeta: ']' };
      case 'larger':
        return { facingMeta: '[** ', sectionName: props.largerLabel, trailingMeta: ']' };
      case 'largest':
        return { facingMeta: '[*** ', sectionName: props.largestLabel, trailingMeta: ']' };
    }
  } else {
    // markdown syntax
    switch (menuItem) {
      case 'normal':
        return { facingMeta: '### ', sectionName: props.normalLabel, trailingMeta: '' };
      case 'larger':
        return { facingMeta: '## ', sectionName: props.largerLabel, trailingMeta: '' };
      case 'largest':
        return { facingMeta: '# ', sectionName: props.largestLabel, trailingMeta: '' };
    }
  }
}
