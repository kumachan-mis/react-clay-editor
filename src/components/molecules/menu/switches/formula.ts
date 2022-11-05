import { State } from '../../../../Editor/types';
import { BlockNode, LineNode } from '../../../../parser/types';
import { isPureLineNode } from '../../../../parser/utils';
import { isEndPoint } from '../common/utils';
import { BlockPosition, ContentPosition } from '../hooks/types';

import { blockMenuSwitch } from './common/block';

export type ContentFormulaMenuSwitch = 'inline' | 'display' | 'off' | 'disabled';

export type BlockFormulaMenuSwitch = 'on' | 'off' | 'disabled';

export function contentFormulaMenuSwitch(
  nodes: LineNode[],
  contentPosition: ContentPosition | undefined
): ContentFormulaMenuSwitch {
  if (!contentPosition) return 'disabled';

  const lineNode = nodes[contentPosition.lineIndex];
  if (!isPureLineNode(lineNode)) return 'disabled';
  if (isEndPoint(contentPosition)) return 'off';

  const contentNode = lineNode.children[contentPosition.contentIndexes[0]];
  switch (contentNode.type) {
    case 'inlineFormula':
      return 'inline';
    case 'displayFormula':
      return 'display';
    case 'normal':
      return 'off';
    default:
      return 'disabled';
  }
}

export function blockFormulaMenuSwitch(
  nodes: (LineNode | BlockNode)[],
  blockPosition: BlockPosition | undefined,
  state: State
): BlockFormulaMenuSwitch {
  return blockMenuSwitch(nodes, blockPosition, state, 'blockFormula');
}
