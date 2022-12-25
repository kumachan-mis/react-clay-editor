import { getLineRange } from '../../common/utils';
import { BlockPosition } from '../../hooks/blockPosition';
import { EditorState } from 'src/contexts/EditorStateContext';
import { BlockNode } from 'src/parser/block/types';
import { isBlockNode } from 'src/parser/block/utils';
import { LineNode } from 'src/parser/line/types';

export type BlockMenuItemType = 'blockCode' | 'blockFormula';

export type BlockMenuSwitch = 'on' | 'off' | 'disabled';

export function blockMenuSwitch(
  nodes: (LineNode | BlockNode)[],
  blockPosition: BlockPosition | undefined,
  state: EditorState,
  menuItemType: BlockMenuItemType
): BlockMenuSwitch {
  if (!state.cursorCoordinate) return 'disabled';
  if (blockPosition) {
    const blockNode = nodes[blockPosition.blockIndex];
    if (!isBlockNode(blockNode) || blockNode.type !== menuItemType) return 'disabled';
    return 'on';
  }

  const { cursorCoordinate, cursorSelection } = state;
  const [firstLineIndex, lastLineIndex] = getLineRange(cursorCoordinate, cursorSelection);

  if (nodes.every((node) => !isBlockNode(node) || node.range[1] < firstLineIndex || lastLineIndex < node.range[0])) {
    return 'off';
  }
  return 'disabled';
}
