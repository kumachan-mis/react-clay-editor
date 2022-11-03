import { coordinatesAreEqual } from '../../components/molecules/cursor/Cursor/utils';
import { TextSelection } from '../../components/molecules/selection/Selection/types';
import { ContentPosition, ContentPositionEndPoint } from '../types';

export function undefinedIfZeroSelection(textSelection: TextSelection | undefined): TextSelection | undefined {
  if (!textSelection) return undefined;
  return !coordinatesAreEqual(textSelection.fixed, textSelection.free) ? textSelection : undefined;
}

export function isEndPoint(contentPosition: ContentPosition): contentPosition is ContentPositionEndPoint {
  return ['empty', 'between', 'leftend', 'rightend'].includes(contentPosition.type);
}
