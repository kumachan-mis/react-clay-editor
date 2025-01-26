import { EditorState } from '../../../../contexts/EditorStateContext';
import { TopLevelNode } from '../../../../parser';
import { LineNode } from '../../../../parser/line/lineNode';
import { isPureLineNode } from '../../../../parser/line/pureLineNode';
import { isEndPoint } from '../common/utils';
import { BlockPosition } from '../hooks/blockPosition';
import { ContentPosition } from '../hooks/contentPosition';

import { blockMenuSwitch } from './common/block';

export type ContentFormulaMenuSwitch = 'inline' | 'display' | 'off' | 'disabled';

export type BlockFormulaMenuSwitch = 'on' | 'off' | 'disabled';

export function contentFormulaMenuSwitch(
  nodes: LineNode[],
  contentPosition: ContentPosition | undefined,
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
  nodes: TopLevelNode[],
  blockPosition: BlockPosition | undefined,
  state: EditorState,
): BlockFormulaMenuSwitch {
  return blockMenuSwitch(nodes, blockPosition, state, 'blockFormula');
}
