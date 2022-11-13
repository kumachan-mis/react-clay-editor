import { TextLabels } from '../../../../common/types';
import { LineNode } from '../../../../parser/line/types';
import { State } from '../../../organisms/Editor/types';
import { TextSelection } from '../../selection/Selection/types';
import { copySelection, undefinedIfZeroSelection } from '../../selection/Selection/utils';
import { ContentPosition } from '../hooks/types';
import { SectionMenuItemType, SectionMenuSwitch } from '../switches/section';

import {
  insertContentAtCursor,
  createContentByTextSelection,
  newCharIndexAfterCreation,
  replaceContentAtCursor,
  newCharIndexAfterReplacement,
} from './common/content';

export type SectionMenuHandlerProps = {
  syntax?: 'bracket' | 'markdown';
} & Required<TextLabels>;

type SectionMeta = {
  facingMeta: string;
  sectionName: string;
  trailingMeta: string;
};

export function handleOnSectionButtonClick(
  text: string,
  nodes: LineNode[],
  state: State,
  props: SectionMenuHandlerProps,
  menuSwitch: SectionMenuSwitch
): [string, State] {
  if (menuSwitch === 'disabled') return [text, state];

  let menuItem: SectionMenuItemType = 'larger';
  if (menuSwitch !== 'off') menuItem = menuSwitch;
  return handleOnSectionItemClick(text, nodes, state, props, menuItem, menuSwitch);
}

export function handleOnSectionItemClick(
  text: string,
  nodes: LineNode[],
  state: State,
  props: SectionMenuHandlerProps,
  menuItem: SectionMenuItemType,
  menuSwitch: SectionMenuSwitch
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

function getSectionMeta(props: SectionMenuHandlerProps, menuItem: SectionMenuItemType): SectionMeta {
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
