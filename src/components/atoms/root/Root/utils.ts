import { RootConstants } from './index';

export function getRoot(element: HTMLElement): HTMLElement | null {
  return element.closest(`div[data-selectid="${RootConstants.selectId}"]`);
}
