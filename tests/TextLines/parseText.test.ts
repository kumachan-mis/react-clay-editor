import { unittest } from '../unittest';
import { BaseTestCaseGroup, BaseTestCase } from '../unittest/types';

import { parseText } from '../../src/TextLines/utils';
import {
  Node,
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
  ParsingOptions,
} from '../../src/TextLines/types';

interface TestCaseGroup extends BaseTestCaseGroup<TestCase> {
  groupName: string;
  options: {
    taggedLinkPatterns: string[];
    disabledMap: { [key in 'bracketLink' | 'hashTag' | 'code' | 'formula']: boolean };
  };
  testCases: TestCase[];
}

interface TestCase extends BaseTestCase {
  testName: string;
  inputLines: string[];
  expectedNodes: NodeWithoutRange[];
}

type NodeWithoutRange =
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

unittest<TestCase, TestCaseGroup>('function', 'TextLines', 'parseText', (group, testCase) => {
  const options: ParsingOptions = {
    disabledMap: group.options.disabledMap,
    taggedLinkRegexes: group.options.taggedLinkPatterns.map((pattern) => RegExp(pattern)),
  };
  const actualNodes = parseText(testCase.inputLines.join('\n'), options);
  expect(isEqualNodesWithoutRange(testCase.expectedNodes, actualNodes)).toBe(true);
});

function isEqualNodesWithoutRange(expected: NodeWithoutRange[], actual: Node[]): boolean {
  return (
    actual.length == expected.length &&
    [...Array(expected.length).keys()].every((i) => isEqualNodeWithoutRange(expected[i], actual[i]))
  );
}

function isEqualNodeWithoutRange(expected: NodeWithoutRange, actual: Node): boolean {
  switch (expected.type) {
    case 'itemization': {
      if (actual.type != 'itemization') return false;
      return (
        actual.lineIndex == expected.lineIndex &&
        actual.indentDepth == expected.indentDepth &&
        actual.children.length == expected.children.length &&
        [...Array(expected.children.length).keys()].every((i) =>
          isEqualNodeWithoutRange(expected.children[i], actual.children[i])
        )
      );
    }
    case 'decoration': {
      if (actual.type != 'decoration') return false;
      return (
        actual.lineIndex == expected.lineIndex &&
        actual.facingMeta == expected.trailingMeta &&
        actual.trailingMeta == expected.trailingMeta &&
        actual.children.length == expected.children.length &&
        [...Array(expected.children.length).keys()].every((i) =>
          isEqualNodeWithoutRange(expected.children[i], actual.children[i])
        )
      );
    }
    case 'blockCodeMeta': {
      if (actual.type != 'blockCodeMeta') return false;
      return (
        actual.lineIndex == expected.lineIndex &&
        actual.indentDepth == expected.indentDepth &&
        actual.meta == expected.meta
      );
    }
    case 'blockCodeLine': {
      if (actual.type != 'blockCodeLine') return false;
      return (
        actual.lineIndex == expected.lineIndex &&
        actual.indentDepth == expected.indentDepth &&
        actual.codeLine == expected.codeLine
      );
    }
    case 'inlineCode': {
      if (actual.type != 'inlineCode') return false;
      return (
        actual.lineIndex == expected.lineIndex &&
        actual.facingMeta == expected.facingMeta &&
        actual.trailingMeta == expected.trailingMeta &&
        actual.code == expected.code
      );
    }
    case 'blockFormula':
    case 'inlineFormula': {
      return (
        actual.type == expected.type &&
        actual.lineIndex == expected.lineIndex &&
        actual.facingMeta == expected.facingMeta &&
        actual.trailingMeta == expected.trailingMeta &&
        actual.formula == expected.formula
      );
    }
    case 'bracketLink': {
      if (actual.type != 'bracketLink') return false;
      return (
        actual.lineIndex == expected.lineIndex &&
        actual.facingMeta == expected.facingMeta &&
        actual.trailingMeta == expected.trailingMeta &&
        actual.linkName == expected.linkName
      );
    }
    case 'hashTag': {
      if (actual.type != 'hashTag') return false;
      return actual.lineIndex == expected.lineIndex && actual.hashTag == expected.hashTag;
    }
    case 'taggedLink': {
      if (actual.type != 'taggedLink') return false;
      return (
        actual.lineIndex == expected.lineIndex &&
        actual.facingMeta == expected.facingMeta &&
        actual.trailingMeta == expected.trailingMeta &&
        actual.tag == expected.tag &&
        actual.linkName == expected.linkName
      );
    }
    case 'normal': {
      if (actual.type != 'normal') return false;
      return actual.lineIndex == expected.lineIndex && actual.text == expected.text;
    }
  }
}
