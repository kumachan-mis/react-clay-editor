import { parseContent } from './parseContent';
import {
  BlockCodeNode,
  BlockCodeMetaNode,
  BlockCodeLineNode,
  BlockFormulaNode,
  BlockFormulaMetaNode,
  BlockFormulaLineNode,
  QuotationNode,
  ItemizationNode,
  NormalLineNode,
  ParsingContext,
  ParsingOptions,
} from './types';
import { TextLinesConstants } from '../constants';

export function parseBlockCode(lines: string[], context: ParsingContext): BlockCodeNode {
  const originalLineIndex = context.lineIndex;
  const facingMeta = parseBlockCodeMeta(lines[context.lineIndex], context);
  context.lineIndex++;
  const metaRegex = TextLinesConstants.regexes.common.blockCodeMeta;
  const lineRegex = TextLinesConstants.regexes.common.blockCodeLine(facingMeta.indentDepth);

  const node: BlockCodeNode = {
    type: 'blockCode',
    range: [originalLineIndex, context.lineIndex],
    facingMeta,
    children: [],
  };

  while (context.lineIndex < lines.length) {
    if (metaRegex.test(lines[context.lineIndex])) {
      const mayTrailingMeta = parseBlockCodeMeta(lines[context.lineIndex], context);
      if (mayTrailingMeta.indentDepth == facingMeta.indentDepth) {
        node.trailingMeta = mayTrailingMeta;
        context.lineIndex++;
      }
      node.range[1] = context.lineIndex - 1;
      return node;
    }

    if (!lineRegex.test(lines[context.lineIndex])) break;
    node.children.push(parseBlockCodeLine(lines[context.lineIndex], context, lineRegex));
    context.lineIndex++;
  }

  node.range[1] = context.lineIndex - 1;
  return node;
}

function parseBlockCodeMeta(line: string, context: ParsingContext): BlockCodeMetaNode {
  const regex = TextLinesConstants.regexes.common.blockCodeMeta;
  const { indent, codeMeta } = line.match(regex)?.groups as Record<string, string>;

  const node: BlockCodeMetaNode = {
    type: 'blockCodeMeta',
    lineIndex: context.lineIndex,
    indentDepth: indent.length,
    codeMeta,
  };

  return node;
}

function parseBlockCodeLine(line: string, context: ParsingContext, regex: RegExp): BlockCodeLineNode {
  const { indent, codeLine } = line.match(regex)?.groups as Record<string, string>;

  const node: BlockCodeLineNode = {
    type: 'blockCodeLine',
    lineIndex: context.lineIndex,
    indentDepth: indent.length,
    codeLine,
  };

  return node;
}

export function parseBlockFormula(lines: string[], context: ParsingContext): BlockFormulaNode {
  const originalLineIndex = context.lineIndex;
  const facingMeta = parseBlockFormulaMeta(lines[context.lineIndex], context);
  context.lineIndex++;
  const metaRegex = TextLinesConstants.regexes.common.blockFormulaMeta;
  const lineRegex = TextLinesConstants.regexes.common.blockFormulaLine(facingMeta.indentDepth);

  const node: BlockFormulaNode = {
    type: 'blockFormula',
    range: [originalLineIndex, context.lineIndex],
    facingMeta,
    children: [],
  };

  while (context.lineIndex < lines.length) {
    if (metaRegex.test(lines[context.lineIndex])) {
      const mayTrailingMeta = parseBlockFormulaMeta(lines[context.lineIndex], context);
      if (mayTrailingMeta.indentDepth == facingMeta.indentDepth) {
        node.trailingMeta = mayTrailingMeta;
        context.lineIndex++;
      }
      node.range[1] = context.lineIndex - 1;
      return node;
    }

    if (!lineRegex.test(lines[context.lineIndex])) break;
    node.children.push(parseBlockFormulaLine(lines[context.lineIndex], context, lineRegex));
    context.lineIndex++;
  }

  node.range[1] = context.lineIndex - 1;
  return node;
}

function parseBlockFormulaMeta(line: string, context: ParsingContext): BlockFormulaMetaNode {
  const regex = TextLinesConstants.regexes.common.blockFormulaMeta;
  const { indent, formulaMeta } = line.match(regex)?.groups as Record<string, string>;

  const node: BlockFormulaMetaNode = {
    type: 'blockFormulaMeta',
    lineIndex: context.lineIndex,
    indentDepth: indent.length,
    formulaMeta,
  };

  return node;
}

function parseBlockFormulaLine(line: string, context: ParsingContext, regex: RegExp): BlockFormulaLineNode {
  const { indent, formulaLine } = line.match(regex)?.groups as Record<string, string>;

  const node: BlockFormulaLineNode = {
    type: 'blockFormulaLine',
    lineIndex: context.lineIndex,
    indentDepth: indent.length,
    formulaLine,
  };

  return node;
}

export function parseQuotation(line: string, context: ParsingContext, options: ParsingOptions): QuotationNode {
  const regex = TextLinesConstants.regexes.common.quotation;
  const { indent, content } = line.match(regex)?.groups as Record<string, string>;

  const node: QuotationNode = {
    type: 'quotation',
    lineIndex: context.lineIndex,
    indentDepth: indent.length,
    contentLength: content.length,
    meta: '>',
    children: parseContent(content, { ...context, charIndex: indent.length + 1 }, options),
  };

  context.lineIndex++;

  return node;
}

export function parseItemization(line: string, context: ParsingContext, options: ParsingOptions): ItemizationNode {
  const regex = TextLinesConstants.regexes.bracketSyntax.itemization;
  const { indent, content } = line.match(regex)?.groups as Record<string, string>;

  const node: ItemizationNode = {
    type: 'itemization',
    lineIndex: context.lineIndex,
    indentDepth: indent.length,
    contentLength: content.length,
    children: parseContent(content, { ...context, charIndex: indent.length }, options),
  };

  context.lineIndex++;

  return node;
}

export function parseNormalLine(line: string, context: ParsingContext, options: ParsingOptions): NormalLineNode {
  const node: NormalLineNode = {
    type: 'normalLine',
    lineIndex: context.lineIndex,
    contentLength: line.length,
    children: parseContent(line, { ...context, charIndex: 0 }, options),
  };

  context.lineIndex++;

  return node;
}
