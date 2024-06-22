import { BracketLinkNode, bracketLinkNodeEquals } from '../bracketLink/bracketLinkNode';
import { HashtagNode, hashtagNodeEquals } from '../hashtag/hashtagNode';
import { TaggedLinkNode, taggedLinkNodeEquals } from '../taggedLink/taggedLinkNode';
import { TextNode } from '../text/textNode';

export type StyledLinkNode = TaggedLinkNode | BracketLinkNode | HashtagNode;

export function isStyledLinkNode(node: TextNode): node is StyledLinkNode {
  return ['taggedLink', 'bracketLink', 'hashtag'].includes(node.type);
}

export function styledLinkNodeEquals(a: StyledLinkNode, b: StyledLinkNode): boolean {
  if (a.type === 'taggedLink' && b.type === 'taggedLink') {
    return taggedLinkNodeEquals(a, b);
  } else if (a.type === 'bracketLink' && b.type === 'bracketLink') {
    return bracketLinkNodeEquals(a, b);
  } else if (a.type === 'hashtag' && b.type === 'hashtag') {
    return hashtagNodeEquals(a, b);
  }
  return false;
}
