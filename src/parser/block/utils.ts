import { LineNode } from '../line/types';

import { BlockNode } from './types';

export function isBlockNode(node: LineNode | BlockNode): node is BlockNode {
  return ['blockCode', 'blockFormula'].includes(node.type);
}
