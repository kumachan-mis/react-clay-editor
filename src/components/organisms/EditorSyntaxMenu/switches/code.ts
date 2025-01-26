import { EditorState } from '../../../../contexts/EditorStateContext';
import { TopLevelNode } from '../../../../parser';
import { LineNode } from '../../../../parser/line/lineNode';
import { isPureLineNode } from '../../../../parser/line/pureLineNode';
import { isEndPoint } from '../common/utils';
import { BlockPosition } from '../hooks/blockPosition';
import { ContentPosition } from '../hooks/contentPosition';

import { blockMenuSwitch } from './common/block';

export type CodeMenuSwitch = 'on' | 'off' | 'disabled';

export function inlineCodeMenuSwitch(nodes: LineNode[], contentPosition: ContentPosition | undefined): CodeMenuSwitch {
  if (!contentPosition) return 'disabled';

  const lineNode = nodes[contentPosition.lineIndex];
  if (!isPureLineNode(lineNode)) return 'disabled';
  if (isEndPoint(contentPosition)) return 'off';

  const contentNode = lineNode.children[contentPosition.contentIndexes[0]];
  switch (contentNode.type) {
    case 'inlineCode':
      return 'on';
    case 'normal':
      return 'off';
    default:
      return 'disabled';
  }
}

export function blockCodeMenuSwitch(
  nodes: TopLevelNode[],
  blockPosition: BlockPosition | undefined,
  state: EditorState,
): CodeMenuSwitch {
  return blockMenuSwitch(nodes, blockPosition, state, 'blockCode');
}
