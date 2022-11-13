import { HashtagNode } from './types';

export function getHashtagName(hashtagNode: HashtagNode): string {
  return hashtagNode.linkName.replaceAll('_', ' ');
}
