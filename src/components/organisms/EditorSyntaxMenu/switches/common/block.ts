import { EditorState } from '../../../../../contexts/EditorStateContext';
import { TopLevelNode } from '../../../../../parser';
import { isBlockNode } from '../../../../../parser/block/blockNode';
import { getLineRange } from '../../common/utils';
import { BlockPosition } from '../../hooks/blockPosition';

export type BlockMenuItemType = 'blockCode' | 'blockFormula';

export type BlockMenuSwitch = 'on' | 'off' | 'disabled';

export function blockMenuSwitch(
  nodes: TopLevelNode[],
  blockPosition: BlockPosition | undefined,
  state: EditorState,
  menuItemType: BlockMenuItemType,
): BlockMenuSwitch {
  if (!state.cursorCoordinate) return 'disabled';
  if (blockPosition) {
    const blockNode = nodes[blockPosition.blockIndex];
    if (!isBlockNode(blockNode) || blockNode.type !== menuItemType) return 'disabled';
    return 'on';
  }

  const { cursorCoordinate, cursorSelection } = state;
  const [firstLineIndex, lastLineIndex] = getLineRange(cursorCoordinate, cursorSelection);

  if (
    nodes.every(
      (node) => !isBlockNode(node) || node._lineRange[1] < firstLineIndex || lastLineIndex < node._lineRange[0],
    )
  ) {
    return 'off';
  }
  return 'disabled';
}
