import React from 'react';

import { BlockFormulaNode } from '../../../parser/types';
import { KaTeX } from '../../atoms/KaTeX';
import { LineGroup } from '../../atoms/LineGroup';
import { LineGroupContent } from '../../atoms/LineGroupContent';
import { LineGroupIndent } from '../../atoms/LineGroupIndent';
import { TextNodeComponentProps } from '../_common/types';

export type BlockFormulaKaTeXProps = TextNodeComponentProps<BlockFormulaNode>;

export const BlockFormulaKaTeX: React.FC<BlockFormulaKaTeXProps> = ({ node }) => {
  const { facingMeta, children, trailingMeta } = node;
  const [first, last] = node.range;
  const formula = children.map((child) => child.formulaLine).join('\n');

  return (
    <LineGroup firstLineIndex={first + 1} lastLineIndex={trailingMeta ? last - 1 : last}>
      <LineGroupIndent indentDepth={facingMeta.indentDepth} />
      <LineGroupContent indentDepth={facingMeta.indentDepth}>
        <KaTeX options={{ throwOnError: false, displayMode: true }}>{formula}</KaTeX>
      </LineGroupContent>
    </LineGroup>
  );
};
