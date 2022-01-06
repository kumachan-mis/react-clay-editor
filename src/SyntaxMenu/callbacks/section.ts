import { moveCursor } from '../../Cursor/utils';
import { insertText } from '../../Editor/callbacks/utils';
import { State } from '../../Editor/types';
import { getTextLineElementAt } from '../../TextLines/utils';
import { SectionMenuConstants } from '../constants';
import { SectionMenuProps } from '../types';

import { MenuHandler } from './types';

export function sectionMenuSwitch(
  syntax: 'bracket' | 'markdown' | undefined,
  state: State,
  element: HTMLElement | null
): 'off' | 'normal' | 'larger' | 'largest' | 'disabled' {
  const { cursorCoordinate, textSelection } = state;
  if (!element || !cursorCoordinate) return 'disabled';
  if (textSelection && textSelection.free.lineIndex !== textSelection.fixed.lineIndex) return 'disabled';

  const lineElement = getTextLineElementAt(cursorCoordinate.lineIndex, element);
  if (!lineElement || lineElement.getAttribute('data-textline') !== 'normalLine') return 'disabled';

  const decorationElements = lineElement.querySelectorAll('span[data-textcontent="decoration"]');
  if (decorationElements.length > 1) return 'disabled';
  if (decorationElements.length === 0) return 'off';

  const line = lineElement.textContent?.slice(0, -1) || '';
  if (line !== decorationElements[0].textContent) return 'disabled';

  if (!syntax || syntax === 'bracket') {
    // bracket syntax
    const match = line.match(SectionMenuConstants.regex.bracket);
    const headingLength = match?.groups?.heading.length;
    if (!headingLength) return 'disabled';
    switch (headingLength) {
      case 1:
        return 'normal';
      case 2:
        return 'larger';
      case 3:
      default:
        return 'largest';
    }
  } else {
    // markdown syntax
    const match = line.match(SectionMenuConstants.regex.markdown);
    const headingLength = match?.groups?.heading.length;
    if (!headingLength) return 'disabled';
    switch (headingLength) {
      case 1:
        return 'largest';
      case 2:
        return 'larger';
      case 3:
      default:
        return 'normal';
    }
  }
}

export function handleOnSectionButtonClick(
  text: string,
  state: State,
  props: MenuHandler<SectionMenuProps>,
  menuSwitch: 'normal' | 'larger' | 'largest' | 'disabled' | 'off'
): [string, State] {
  if (menuSwitch === 'disabled') return [text, state];

  let menuItem: 'normal' | 'larger' | 'largest' = 'larger';
  if (menuSwitch !== 'off') menuItem = menuSwitch;
  return handleOnSectionItemClick(text, state, props, menuItem, menuSwitch);
}

export function handleOnSectionItemClick(
  text: string,
  state: State,
  props: MenuHandler<SectionMenuProps>,
  menuItem: 'normal' | 'larger' | 'largest',
  menuSwitch: 'normal' | 'larger' | 'largest' | 'disabled' | 'off'
): [string, State] {
  const { cursorCoordinate, textSelection } = state;
  if (!cursorCoordinate || menuSwitch === 'disabled') return [text, state];

  const [facingMeta, sectionName, trailingMeta] = getSectionMeta(props.syntax, menuItem, props);
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

  const [newCursorCoordinate, newTextSelection] = [
    { ...cursorCoordinate },
    textSelection ? { fixed: { ...textSelection.fixed }, free: { ...textSelection.free } } : undefined,
  ];

  let body = line;
  if (menuSwitch !== 'off') {
    const regex = SectionMenuConstants.regex[props.syntax || 'bracket'];
    const groups = line.match(regex)?.groups as Record<string, string>;

    const moveCharIndexByMetaDeletion = (charIndex: number): number =>
      Math.min(
        Math.max(charIndex - groups.facingMeta.length, 0),
        line.length - groups.facingMeta.length - groups.trailingMeta.length
      );

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
): [string, string, string] {
  if (!syntax || syntax === 'bracket') {
    // bracket syntax
    switch (menuItem) {
      case 'normal':
        return ['[* ', props.normalLabel, ']'];
      case 'larger':
        return ['[** ', props.largerLabel, ']'];
      case 'largest':
        return ['[*** ', props.largestLabel, ']'];
    }
  } else {
    // markdown syntax
    switch (menuItem) {
      case 'normal':
        return ['### ', props.normalLabel, ''];
      case 'larger':
        return ['## ', props.largerLabel, ''];
      case 'largest':
        return ['# ', props.largestLabel, ''];
    }
  }
}
