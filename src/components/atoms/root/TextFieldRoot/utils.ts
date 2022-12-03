import { TextFieldRootConstants } from './index';

export function getTextFieldRoot(element: HTMLElement): HTMLElement | null {
  return element.closest(`div[data-selectid="${TextFieldRootConstants.selectId}"]`);
}
