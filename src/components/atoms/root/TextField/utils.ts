import { TextFieldConstants } from './index';

export function getTextField(element: HTMLElement): HTMLElement | null {
  return element.closest(`div[data-selectid="${TextFieldConstants.selectId}"]`);
}
