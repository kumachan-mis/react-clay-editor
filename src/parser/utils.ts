import { BlockNode, LineNode, PureLineNode } from './types';

export function splitTag(taggedLinkFacingMeta: string): [string, string] {
  return [taggedLinkFacingMeta.substring(0, 1), taggedLinkFacingMeta.substring(1)];
}

export function getTagName(taggedLinkFacingMeta: string): string {
  return taggedLinkFacingMeta.substring(1, taggedLinkFacingMeta.length - 2);
}

export function getHashtagName(linkName: string): string {
  return linkName.replaceAll('_', ' ');
}

export function isPureLineNode(lineNode: LineNode): lineNode is PureLineNode {
  return ['quotation', 'itemization', 'normalLine'].includes(lineNode.type);
}

export function isBlockNode(lineNode: LineNode | BlockNode): lineNode is BlockNode {
  return ['blockCode', 'blockFormula'].includes(lineNode.type);
}
