import { EditorRootConstants } from './index';

export function getEditorRoot(element: HTMLElement): HTMLElement | null {
  return element.closest(`div[data-selectid="${EditorRootConstants.selectId}"]`);
}
