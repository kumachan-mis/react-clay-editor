import { TextFieldBodyConstants } from './index';

export function getTextFieldBody(element: HTMLElement): HTMLElement | null {
  return element.closest(`div[data-selectid="${TextFieldBodyConstants.selectId}"]`);
}
