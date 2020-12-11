import {
  ItemizationNode,
  BlockCodeMetaNode,
  BlockCodeLineNode,
  InlineCodeNode,
  BlockFormulaNode,
  InlineFormulaNode,
  DecorationNode,
  TaggedLinkNode,
  BracketLinkNode,
  HashTagNode,
  NormalNode,
} from '../../../src/TextLines/types';

export interface TestFixtures {
  testCaseGroups: {
    groupName: string;
    options: {
      taggedLinkPatterns: string[];
      disabledMap: { [key in 'bracketLink' | 'hashTag' | 'code' | 'formula']: boolean };
    };
    testCases: {
      testName: string;
      inputLines: string[];
      expectedNodes: NodeWithoutRange[];
    }[];
  }[];
}

export type NodeWithoutRange =
  | (Omit<ItemizationNode, 'range' | 'children'> & { children: NodeWithoutRange[] })
  | Omit<BlockCodeMetaNode, 'range'>
  | Omit<BlockCodeLineNode, 'range'>
  | Omit<InlineCodeNode, 'range'>
  | Omit<BlockFormulaNode, 'range'>
  | Omit<InlineFormulaNode, 'range'>
  | (Omit<DecorationNode, 'range' | 'children'> & { children: NodeWithoutRange[] })
  | Omit<TaggedLinkNode, 'range'>
  | Omit<BracketLinkNode, 'range'>
  | Omit<HashTagNode, 'range'>
  | Omit<NormalNode, 'range'>;
