import { parseBlockCode } from '../blockCode/parseBlockCode';
import { blockCodeMetaRegex } from '../blockCode/parseBlockCodeMeta';
import { parseBlockFormula } from '../blockFormula/parseBlockFormula';
import { blockFormulaMetaRegex } from '../blockFormula/parseBlockFormulaMeta';
import { ParsingContext } from '../common/parsingContext';
import { ParsingOptions } from '../common/parsingOptions';

import { BlockNode } from './blockNode';

export function parseBlock(lines: string[], context: ParsingContext, options: ParsingOptions): BlockNode | undefined {
  const line = lines[context.lineIndex];
  if (!options.codeDisabled && blockCodeMetaRegex.test(line)) {
    return parseBlockCode(lines, context);
  } else if (!options.formulaDisabled && blockFormulaMetaRegex.test(line)) {
    return parseBlockFormula(lines, context);
  }
}
