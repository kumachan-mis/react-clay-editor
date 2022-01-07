import { coordinatesAreEqual } from '../../Cursor/utils';
import { TextSelection } from '../../Selection/types';

export function undefinedIfZeroSelection(textSelection: TextSelection | undefined): TextSelection | undefined {
  if (!textSelection) return undefined;
  return !coordinatesAreEqual(textSelection.fixed, textSelection.free) ? textSelection : undefined;
}
