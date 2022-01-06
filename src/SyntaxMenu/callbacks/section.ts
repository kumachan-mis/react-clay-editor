import { moveCursor } from '../../Cursor/utils';
import { insertText } from '../../Editor/callbacks/utils';
import { State } from '../../Editor/types';
import { copySelection } from '../../Selection/utils';
import { DecorationNode, LineNode } from '../../parser/types';
import { SectionMenuProps } from '../types';

import { MenuHandler } from './types';

export function sectionMenuSwitch(
  syntax: 'bracket' | 'markdown' | undefined,
  nodes: LineNode[],
  state: State,
  element: HTMLElement | null
): 'off' | 'normal' | 'larger' | 'largest' | 'disabled' {
  if (!element) return 'disabled';

  const { cursorCoordinate, textSelection } = state;
  if (!cursorCoordinate || (textSelection && textSelection.free.lineIndex !== textSelection.fixed.lineIndex)) {
    return 'disabled';
  }

  const lineNode = nodes[cursorCoordinate.lineIndex];
  if (lineNode.type !== 'normalLine') return 'disabled';

  const decorationNodes = lineNode.children.filter((node) => node.type === 'decoration') as DecorationNode[];
  if (decorationNodes.length > 1 || (decorationNodes.length === 1 && lineNode.children.length !== 1)) return 'disabled';

  if (decorationNodes.length === 0) return 'off';

  const decorationNode = decorationNodes[0];
  if ((!syntax || syntax === 'bracket') && !/^\[\*+ $/.test(decorationNode.facingMeta)) return 'disabled';
  else if (syntax === 'markdown' && !/^#+ $/.test(decorationNode.facingMeta)) return 'disabled';

  return decorationNode.decoration.fontlevel;
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

  const { facingMeta, sectionName, trailingMeta, regex } = getSectionMeta(props.syntax, menuItem, props);
  const line = text.split('\n')[cursorCoordinate.lineIndex];
  if (!line) {
    const insertedText = facingMeta + sectionName + trailingMeta;
    const cursourMoveAmount = facingMeta.length + sectionName.length;
    const [newText, newState] = insertText(text, state, insertedText, cursourMoveAmount);
    if (!newState.cursorCoordinate) return [newText, { ...newState, textSelection: undefined }];

    const fixed = moveCursor(newText, newState.cursorCoordinate, -sectionName.length);
    const free = newState.cursorCoordinate;
    return [newText, { ...newState, textSelection: { fixed, free } }];
  }

  const [newCursorCoordinate, newTextSelection] = [{ ...cursorCoordinate }, copySelection(textSelection)];

  let body = line;
  if (menuSwitch !== 'off') {
    const groups = line.match(regex)?.groups as Record<string, string>;
    const moveCharIndexByMetaDeletion = (charIndex: number): number => {
      const newCharIndex = charIndex - groups.facingMeta.length;
      if (newCharIndex < 0) return 0;
      if (newCharIndex > groups.body.length) return groups.body.length;
      return newCharIndex;
    };
    body = groups.body;
    newCursorCoordinate.charIndex = moveCharIndexByMetaDeletion(newCursorCoordinate.charIndex);
    if (newTextSelection) {
      newTextSelection.fixed.charIndex = moveCharIndexByMetaDeletion(newTextSelection.fixed.charIndex);
      newTextSelection.free.charIndex = moveCharIndexByMetaDeletion(newTextSelection.free.charIndex);
    }
  }

  const lineSelection = {
    fixed: { lineIndex: cursorCoordinate.lineIndex, charIndex: 0 },
    free: { lineIndex: cursorCoordinate.lineIndex, charIndex: line.length },
  };

  if (menuSwitch === menuItem) {
    const [newText, newState] = insertText(text, { ...state, textSelection: lineSelection }, body);
    return [newText, { ...newState, cursorCoordinate: newCursorCoordinate, textSelection: newTextSelection }];
  }

  const insertedText = facingMeta + body + trailingMeta;
  const [newText, newState] = insertText(text, { ...state, textSelection: lineSelection }, insertedText);
  newCursorCoordinate.charIndex = newCursorCoordinate.charIndex + facingMeta.length;
  if (newTextSelection) {
    newTextSelection.fixed.charIndex = newTextSelection.fixed.charIndex + facingMeta.length;
    newTextSelection.free.charIndex = newTextSelection.free.charIndex + facingMeta.length;
  }
  return [newText, { ...newState, cursorCoordinate: newCursorCoordinate, textSelection: newTextSelection }];
}

function getSectionMeta(
  syntax: 'bracket' | 'markdown' | undefined,
  menuItem: 'normal' | 'larger' | 'largest',
  props: MenuHandler<SectionMenuProps>
): { facingMeta: string; sectionName: string; trailingMeta: string; regex: RegExp } {
  if (!syntax || syntax === 'bracket') {
    // bracket syntax
    const trailingMeta = ']';
    const regex = /^(?<facingMeta>\[(?<heading>\*+) )(?<body>(\[[^\]]+\]|[^\]])+)(?<trailingMeta>\])$/;
    switch (menuItem) {
      case 'normal':
        return { facingMeta: '[* ', sectionName: props.normalLabel, trailingMeta, regex };
      case 'larger':
        return { facingMeta: '[** ', sectionName: props.largerLabel, trailingMeta, regex };
      case 'largest':
        return { facingMeta: '[*** ', sectionName: props.largestLabel, trailingMeta, regex };
    }
  } else {
    // markdown syntax
    const trailingMeta = '';
    const regex = /^(?<facingMeta>(?<heading>#+) )(?<body>.+)(?<trailingMeta>)$/;
    switch (menuItem) {
      case 'normal':
        return { facingMeta: '### ', sectionName: props.normalLabel, trailingMeta, regex };
      case 'larger':
        return { facingMeta: '## ', sectionName: props.largerLabel, trailingMeta, regex };
      case 'largest':
        return { facingMeta: '# ', sectionName: props.largestLabel, trailingMeta, regex };
    }
  }
}
