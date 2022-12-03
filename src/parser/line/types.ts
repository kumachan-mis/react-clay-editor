import { BlockCodeLineNode, BlockCodeMetaNode } from '../blockCode/types';
import { BlockFormulaLineNode, BlockFormulaMetaNode } from '../blockFormula/types';
import { ItemizationNode } from '../itemization/types';
import { NormalLineNode } from '../normalLine/types';
import { QuotationNode } from '../quotation/types';

export type LineNode = BlockLineNode | PureLineNode;

export type BlockLineNode = BlockCodeMetaNode | BlockCodeLineNode | BlockFormulaMetaNode | BlockFormulaLineNode;

export type PureLineNode = QuotationNode | ItemizationNode | NormalLineNode;
