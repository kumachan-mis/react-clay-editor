import { TaggedLinkNode } from './types';

export function splitTag(taggedLinkNode: TaggedLinkNode): [string, string] {
  return [taggedLinkNode.facingMeta.substring(0, 1), taggedLinkNode.facingMeta.substring(1)];
}

export function getTagName(taggedLinkNode: TaggedLinkNode): string {
  return taggedLinkNode.facingMeta.substring(1, taggedLinkNode.facingMeta.length - 2);
}
