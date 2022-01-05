import { CursorCoordinate } from '../../Cursor/types';
import { insertText } from '../../Editor/callbacks/utils';
import { State } from '../../Editor/types';
import { getTextLineElementAt } from '../../TextLines/utils';
import { SectionMenuProps } from '../types';

import { MenuHandler } from './types';
import { updateSelectionByMenu } from './utils';

export function sectionMenuSwitch(
  syntax: 'bracket' | 'markdown' | undefined,
  state: State,
  element: HTMLElement | null
): 'off' | 'normal' | 'larger' | 'largest' | 'disabled' {
  const { cursorCoordinate, textSelection } = state;
  if (!element || !cursorCoordinate) return 'disabled';
  if (textSelection && Math.abs(textSelection.free.lineIndex - textSelection.fixed.lineIndex) > 0) return 'disabled';

  const lineElement = getTextLineElementAt(cursorCoordinate.lineIndex, element);
  if (!lineElement || lineElement.getAttribute('data-textline') !== 'normalLine') return 'disabled';

  const decorationElements = lineElement.querySelectorAll('span[data-textcontent="decoration"]');
  if (decorationElements.length > 1) return 'disabled';
  if (decorationElements.length === 0) return 'off';

  const line = lineElement.textContent?.slice(0, -1) || '';
  if (line !== decorationElements[0].textContent) return 'disabled';

  if (!syntax || syntax === 'bracket') {
    // bracket syntax
    if (/^\[\* [^\]]+\]$/.test(line)) return 'normal';
    if (/^\[\*{2} [^\]]+\]$/.test(line)) return 'larger';
    if (/^\[\*{3,} [^\]]+\]$/.test(line)) return 'largest';
  } else {
    // markdown syntax
    if (/^#{3,} .+$/.test(line)) return 'normal';
    if (/^#{2} .+$/.test(line)) return 'larger';
    if (/^# .+$/.test(line)) return 'largest';
  }

  return 'disabled';
}

export function handleOnSectionButtonClick(
  text: string,
  state: State,
  props: MenuHandler<SectionMenuProps>,
  element: HTMLElement | null
): [string, State] {
  const menuSwitch = sectionMenuSwitch(props.syntax, state, element);
  if (menuSwitch === 'disabled') return [text, state];

  let menuItem: 'normal' | 'larger' | 'largest' = 'larger';
  if (menuSwitch !== 'off') menuItem = menuSwitch;
  return handleOnSectionItemClick(text, state, props, element, menuItem);
}
export function handleOnSectionItemClick(
  text: string,
  state: State,
  props: MenuHandler<SectionMenuProps>,
  element: HTMLElement | null,
  menuItem: 'normal' | 'larger' | 'largest'
): [string, State] {
  const { cursorCoordinate, textSelection } = state;
  const menuSwitch = sectionMenuSwitch(props.syntax, state, element);
  if (!cursorCoordinate || menuSwitch === 'disabled') return [text, state];

  return [text, state];
}
