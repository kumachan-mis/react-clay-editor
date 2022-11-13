import { parseBlockCode } from '../blockCode/parseBlockCode';
import { blockCodeMetaRegex } from '../blockCode/parseBlockCodeMeta';
import { parseBlockFormula } from '../blockFormula/parseBlockFormula';
import { blockFormulaMetaRegex } from '../blockFormula/parseBlockFormulaMeta';
import { ParsingContext, ParsingOptions } from '../common/types';

import { BlockNode } from './types';

export function parseBlock(lines: string[], context: ParsingContext, options: ParsingOptions): BlockNode | undefined {
  const line = lines[context.lineIndex];
  if (!options.codeDisabled && blockCodeMetaRegex.test(line)) {
    return parseBlockCode(lines, context);
  } else if (!options.formulaDisabled && blockFormulaMetaRegex.test(line)) {
    return parseBlockFormula(lines, context);
  }
}
