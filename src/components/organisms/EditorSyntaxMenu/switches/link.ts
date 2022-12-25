import { getNestedContentNodeIfNonEndPoint } from '../common/utils';
import { ContentPosition } from '../hooks/contentPosition';
import { LineNode } from 'src/parser/line/types';
import { isPureLineNode } from 'src/parser/line/utils';

export type LinkMenuSwitch = 'on' | 'off' | 'disabled';

export type LinkMenuItemType = 'bracketLink' | 'taggedLink' | 'hashtag';

export type LinkMenuItem = { type: 'bracketLink' } | { type: 'taggedLink'; tag: string } | { type: 'hashtag' };

export function linkMenuSwitch(
  nodes: LineNode[],
  contentPosition: ContentPosition | undefined,
  menuItemType: LinkMenuItemType
): LinkMenuSwitch {
  if (!contentPosition) return 'disabled';
  const lineNode = nodes[contentPosition.lineIndex];
  if (!isPureLineNode(lineNode)) return 'disabled';
  const contentNode = getNestedContentNodeIfNonEndPoint(lineNode, contentPosition);
  if (!contentNode) return 'off';

  if (contentNode.type === menuItemType) return 'on';
  if (contentNode.type === 'normal') return 'off';
  return 'disabled';
}
