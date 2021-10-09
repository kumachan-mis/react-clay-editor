import { EditorConstants } from './constants';

export function getRoot(element: HTMLElement): HTMLElement | null {
  return element.closest(`div[data-selectid="${EditorConstants.root.selectId}"]`);
}

export function getBody(element: HTMLElement): HTMLElement | null {
  return element.closest(`div[data-selectid="${EditorConstants.body.selectId}"]`);
}
