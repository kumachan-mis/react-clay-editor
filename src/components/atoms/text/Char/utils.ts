import { getEditorRoot } from '../../editor/EditorRoot/utils';

import { CharConstants } from './index';

export function getCharAt(lineIndex: number, charIndex: number, element: HTMLElement): HTMLElement | null {
  let rootElement = getEditorRoot(element);
  if (!rootElement) rootElement = element;
  return rootElement.querySelector(`span[data-selectid="${CharConstants.selectId(lineIndex, charIndex)}"]`);
}
