import { getEditor } from '../Editor/utils';

import { ComponentConstants } from './components/constants';

export function getTextCharElementAt(lineIndex: number, charIndex: number, element: HTMLElement): HTMLElement | null {
  let editorElement = getEditor(element);
  if (!editorElement) editorElement = element;
  return editorElement.querySelector(`span[data-selectid="${ComponentConstants.char.selectId(lineIndex, charIndex)}"]`);
}
