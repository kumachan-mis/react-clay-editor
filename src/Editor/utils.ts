import { EditorConstants } from './constants';

export function getEditor(element: HTMLElement): HTMLElement | null {
  return element.closest(`div[data-selectid="${EditorConstants.editor.selectId}"]`);
}

export function getBody(element: HTMLElement): HTMLElement | null {
  return element.closest(`div[data-selectid="${EditorConstants.body.selectId}"]`);
}
