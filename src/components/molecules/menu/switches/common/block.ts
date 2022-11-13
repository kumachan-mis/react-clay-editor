import { BlockNode } from '../../../../../parser/block/types';
import { isBlockNode } from '../../../../../parser/block/utils';
import { LineNode } from '../../../../../parser/line/types';
import { State } from '../../../../organisms/Editor/types';
import { getLineRange } from '../../common/utils';
import { BlockPosition } from '../../hooks/types';

export type BlockMenuItemType = 'blockCode' | 'blockFormula';

export type BlockMenuSwitch = 'on' | 'off' | 'disabled';

export function blockMenuSwitch(
  nodes: (LineNode | BlockNode)[],
  blockPosition: BlockPosition | undefined,
  state: State,
  menuItemType: BlockMenuItemType
): BlockMenuSwitch {
  if (!state.cursorCoordinate) return 'disabled';
  if (blockPosition) {
    const blockNode = nodes[blockPosition.blockIndex];
    if (!isBlockNode(blockNode) || blockNode.type !== menuItemType) return 'disabled';
    return 'on';
  }

  const { cursorCoordinate, textSelection } = state;
  const [firstLineIndex, lastLineIndex] = getLineRange(cursorCoordinate, textSelection);

  if (nodes.every((node) => !isBlockNode(node) || node.range[1] < firstLineIndex || lastLineIndex < node.range[0])) {
    return 'off';
  }
  return 'disabled';
}
