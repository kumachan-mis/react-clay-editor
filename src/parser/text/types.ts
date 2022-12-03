import { BlockNode } from '../block/types';
import { ContentNode } from '../content/types';
import { LineNode } from '../line/types';

export type TextNode = BlockNode | LineNode | ContentNode;
