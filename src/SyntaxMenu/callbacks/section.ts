import { CursorCoordinate } from '../../Cursor/types';
import { insertText } from '../../Editor/callbacks/utils';
import { State } from '../../Editor/types';
import { getTextLineElementAt } from '../../TextLines/utils';
import { SectionMenuProps } from '../types';

import { updateSelectionByMenu } from './utils';

export function sectionMenuSwitch(
  state: State,
  element: HTMLElement | null,
  syntax?: 'bracket' | 'markdown'
): 'disabled' | 'off' | 'normal' | 'larger' | 'largest' {
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

export function handleSectionMenu(
  text: string,
  state: State,
  props: Required<SectionMenuProps>,
  element: HTMLElement | null,
  item: 'normal' | 'larger' | 'largest',
  syntax?: 'bracket' | 'markdown'
): [string, State] {
  const menuSwitch = sectionMenuSwitch(state, element, syntax);
  console.log(menuSwitch);
  if (menuSwitch === 'disabled') return [text, state];

  return [text, state];
}
