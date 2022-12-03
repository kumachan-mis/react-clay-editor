import { LineNode, PureLineNode } from './types';

export function isPureLineNode(lineNode: LineNode): lineNode is PureLineNode {
  return ['quotation', 'itemization', 'normalLine'].includes(lineNode.type);
}
