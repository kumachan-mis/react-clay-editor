import { EditorState } from '../../../../contexts/EditorStateContext';
import { LineNode } from '../../../../parser/line/lineNode';
import { TextLabels } from '../../../../types/label/text';
import { CursorSelection } from '../../../../types/selection/cursorSelection';
import { copySelection, undefinedIfZeroSelection } from '../../../molecules/selection/Selection/utils';
import { ContentPosition } from '../hooks/contentPosition';
import { SectionMenuItemType, SectionMenuSwitch } from '../switches/section';

import {
  insertContentAtCursor,
  createContentByCursorSelection,
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
  state: EditorState,
  props: SectionMenuHandlerProps,
  menuSwitch: SectionMenuSwitch
): [string, EditorState] {
  if (menuSwitch === 'disabled') return [text, state];

  let menuItem: SectionMenuItemType = 'larger';
  if (menuSwitch !== 'off') menuItem = menuSwitch;
  return handleOnSectionItemClick(text, nodes, state, props, menuItem, menuSwitch);
}

export function handleOnSectionItemClick(
  text: string,
  nodes: LineNode[],
  state: EditorState,
  props: SectionMenuHandlerProps,
  menuItem: SectionMenuItemType,
  menuSwitch: SectionMenuSwitch
): [string, EditorState] {
  const { cursorCoordinate, cursorSelection } = state;
  if (!cursorCoordinate || menuSwitch === 'disabled') return [text, state];
  const lineNode = nodes[cursorCoordinate.lineIndex];
  if (lineNode.type !== 'normalLine') return [text, state];

  const { facingMeta, sectionName, trailingMeta } = getSectionMeta(props, menuItem);
  const line = text.split('\n')[cursorCoordinate.lineIndex];
  if (!line) return insertContentAtCursor(text, nodes, state, { facingMeta, content: sectionName, trailingMeta });

  const lineSelection: CursorSelection = {
    fixed: { lineIndex: cursorCoordinate.lineIndex, charIndex: 0 },
    free: { lineIndex: cursorCoordinate.lineIndex, charIndex: line.length },
  };
  const dummyState = { ...state, cursorSelection: lineSelection };

  if (menuSwitch === 'off') {
    const config = { facingMeta, trailingMeta };
    const [newText, newState] = createContentByCursorSelection(text, nodes, dummyState, config);
    const [newCursorCoordinate, newCursorSelection] = [{ ...cursorCoordinate }, copySelection(cursorSelection)];
    const newCharIndex = (charIndex: number) => newCharIndexAfterCreation(charIndex, lineSelection, config);
    newCursorCoordinate.charIndex = newCharIndex(newCursorCoordinate.charIndex);
    if (newCursorSelection) {
      newCursorSelection.fixed.charIndex = newCharIndex(newCursorSelection.fixed.charIndex);
      newCursorSelection.free.charIndex = newCharIndex(newCursorSelection.free.charIndex);
    }
    return [
      newText,
      {
        ...newState,
        cursorCoordinate: newCursorCoordinate,
        cursorSelection: undefinedIfZeroSelection(newCursorSelection),
      },
    ];
  }

  const decorationNode = lineNode.children[0];
  if (decorationNode.type === 'decoration') {
    const config = menuSwitch === menuItem ? { facingMeta: '', trailingMeta: '' } : { facingMeta, trailingMeta };
    const position: ContentPosition = { type: 'inner', lineIndex: cursorCoordinate.lineIndex, contentIndexes: [0] };
    const [newText, newState] = replaceContentAtCursor(text, nodes, position, dummyState, config);
    const [newCursorCoordinate, newCursorSelection] = [{ ...cursorCoordinate }, copySelection(cursorSelection)];
    const newCharIndex = (charIndex: number) => newCharIndexAfterReplacement(charIndex, decorationNode, config);
    newCursorCoordinate.charIndex = newCharIndex(newCursorCoordinate.charIndex);
    if (newCursorSelection) {
      newCursorSelection.fixed.charIndex = newCharIndex(newCursorSelection.fixed.charIndex);
      newCursorSelection.free.charIndex = newCharIndex(newCursorSelection.free.charIndex);
    }
    return [
      newText,
      {
        ...newState,
        cursorCoordinate: newCursorCoordinate,
        cursorSelection: undefinedIfZeroSelection(newCursorSelection),
      },
    ];
  }

  return [text, state];
}

function getSectionMeta(props: SectionMenuHandlerProps, menuItem: SectionMenuItemType): SectionMeta {
  if (!props.syntax || props.syntax === 'bracket') {
    // Bracket syntax
    switch (menuItem) {
      case 'normal':
        return { facingMeta: '[* ', sectionName: props.normalLabel, trailingMeta: ']' };
      case 'larger':
        return { facingMeta: '[** ', sectionName: props.largerLabel, trailingMeta: ']' };
      case 'largest':
        return { facingMeta: '[*** ', sectionName: props.largestLabel, trailingMeta: ']' };
    }
  } else {
    // Markdown syntax
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
