import { NodeWithoutRange } from './types';
import { Node } from '../../src/TextLines/types';

export function isEqualNodesWithoutRange(expected: NodeWithoutRange[], actual: Node[]): boolean {
  return (
    actual.length == expected.length &&
    [...Array(expected.length).keys()].every((i) => isEqualNodeWithoutRange(expected[i], actual[i]))
  );
}

export function isEqualNodeWithoutRange(expected: NodeWithoutRange, actual: Node): boolean {
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
    case 'blockFormula': {
      if (actual.type != 'blockFormula') return false;
      return (
        actual.lineIndex == expected.lineIndex &&
        actual.facingMeta == expected.facingMeta &&
        actual.trailingMeta == expected.trailingMeta &&
        actual.formula == expected.formula
      );
    }
    case 'inlineFormula': {
      if (actual.type != 'inlineFormula') return false;
      return (
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
