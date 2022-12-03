import { ContentNode, TextLikeNode } from './types';

export function isTextLikeNode(contentNode: ContentNode): contentNode is TextLikeNode {
  return ['url', 'normal'].includes(contentNode.type);
}
