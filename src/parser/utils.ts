import { LineNode, PureLineNode } from './types';

export function getTagName(tag: string): string {
  return tag.substring(0, tag.length - 2);
}

export function getHashtagName(linkName: string): string {
  return linkName.replaceAll('_', ' ');
}

export function isPureLineNode(lineNode: LineNode): lineNode is PureLineNode {
  return ['quotation', 'itemization', 'normalLine'].includes(lineNode.type);
}
