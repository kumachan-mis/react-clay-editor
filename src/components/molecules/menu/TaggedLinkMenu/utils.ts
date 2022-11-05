import { LineNode } from '../../../../parser/types';
import { getTagName, isPureLineNode } from '../../../../parser/utils';
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
  return getTagName(contentNode.facingMeta);
}
