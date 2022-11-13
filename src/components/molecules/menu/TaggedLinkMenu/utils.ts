import { LineNode } from '../../../../parser/line/types';
import { isPureLineNode } from '../../../../parser/line/utils';
import { getTagName } from '../../../../parser/taggedLink/utils';
import { getNestedContentNodeIfNonEndPoint } from '../common/utils';
import { ContentPosition } from '../hooks/types';

export function getTagNameAtPosition(
  nodes: LineNode[],
  contentPosition: ContentPosition | undefined
): string | undefined {
  if (!contentPosition) return undefined;
  const lineNode = nodes[contentPosition.lineIndex];
  if (!isPureLineNode(lineNode)) return undefined;
  const contentNode = getNestedContentNodeIfNonEndPoint(lineNode, contentPosition);
  if (!contentNode || contentNode.type !== 'taggedLink') return undefined;
  return getTagName(contentNode);
}
