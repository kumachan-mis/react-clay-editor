import { generateRandomId } from '../../common/utils';
import { parseBlock } from '../block/parseBlock';
import { ParsingContext } from '../common/parsingContext';
import { ParsingOptions } from '../common/parsingOptions';
import { ParsingPerformanceHints } from '../common/parsingPerformanceHints';
import { lineNodeToString } from '../line/lineNode';
import { parseLine } from '../line/parseLine';

import { TopLevelNode, topLevelNodeToLineNodes } from './topLevelNode';

export function parseText(text: string, options: ParsingOptions, hints?: ParsingPerformanceHints): TopLevelNode[] {
  const nodes: TopLevelNode[] = [];
  const lines = text.split('\n');

  const context: ParsingContext = {
    lineIds: generateLineIds(lines, hints?.prevNodes ?? []),
    lineIndex: 0,
    charIndex: 0,
    nested: false,
    decorationConfig: { size: 'normal', bold: false, italic: false, underline: false },
  };

  while (context.lineIndex < lines.length) {
    const blockNode = parseBlock(lines, context, options);
    if (blockNode) {
      nodes.push(blockNode);
      continue;
    }

    const lineNode = parseLine(lines[context.lineIndex], options, context);
    nodes.push(lineNode);
  }

  return nodes;
}

function generateLineIds(lines: string[], prevNodes: TopLevelNode[]): string[] {
  const prevLineNodes = topLevelNodeToLineNodes(prevNodes);
  const prevLines = prevLineNodes.map(lineNodeToString);

  const backwardCount = (() => {
    let count = 0;
    while (count < lines.length) {
      const line = lines[lines.length - 1 - count];
      const prevLine = prevLines[prevLines.length - 1 - count];
      if (line !== prevLine) break;
      count++;
    }
    return count;
  })();
  const backwardReusedLineIds = backwardCount > 0 ? prevLineNodes.slice(-backwardCount).map((node) => node.lineId) : [];

  if (lines.length <= prevLines.length) {
    const forwardCount = lines.length - backwardCount;
    const forwardReusedLineIds = prevLineNodes.slice(0, forwardCount).map((node) => node.lineId);

    return [...forwardReusedLineIds, ...backwardReusedLineIds];
  }

  const forwardCount = prevLines.length - backwardCount;
  const forwardReusedLineIds = prevLineNodes.slice(0, forwardCount).map((node) => node.lineId);

  const generatedLineIds = [...Array(lines.length - forwardCount - backwardCount).keys()].map(generateRandomId);
  return [...forwardReusedLineIds, ...generatedLineIds, ...backwardReusedLineIds];
}
