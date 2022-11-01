import { SyntaxNode } from '../../../parser/types';
import { CursorCoordinate } from '../Cursor/types';
import { TextSelection } from '../Selection/types';
import { selectionToRange } from '../Selection/utils';

export function cursorOnSyntaxNode(
  node: SyntaxNode,
  cursorCoordinate: CursorCoordinate | undefined,
  textSelection: TextSelection | undefined
): boolean {
  function cursor(): boolean {
    if (!cursorCoordinate) return false;
    if (node.type === 'blockCode' || node.type === 'blockFormula') {
      const [first, last] = node.range;
      return first <= cursorCoordinate.lineIndex && cursorCoordinate.lineIndex <= last;
    }
    return cursorCoordinate.lineIndex === node.lineIndex;
  }

  function selection(): boolean {
    if (!textSelection) return false;
    const { start, end } = selectionToRange(textSelection);

    if (node.type === 'blockCode' || node.type === 'blockFormula') {
      const [first, last] = node.range;
      return start.lineIndex <= last && first <= end.lineIndex;
    }
    return start.lineIndex <= node.lineIndex && node.lineIndex <= end.lineIndex;
  }

  return cursor() || selection();
}
