import { TextNodeComponentProps } from '../common/types';
import { KaTeX } from 'src/components/atoms/text/KaTeX';
import { LineGroup } from 'src/components/atoms/text/LineGroup';
import { LineGroupContent } from 'src/components/atoms/text/LineGroupContent';
import { LineGroupIndent } from 'src/components/atoms/text/LineGroupIndent';
import { BlockFormulaNode } from 'src/parser/blockFormula/types';

import { BlockFormulaLine } from './BlockFormulaLine';
import { BlockFormulaMeta } from './BlockFormulaMeta';

import React from 'react';

export type BlockFormulaProps = TextNodeComponentProps<BlockFormulaNode>;

export const BlockFormulaConstants = {
  styleId: 'block-formula',
};

export const BlockFormula: React.FC<BlockFormulaProps> = ({ node, getEditMode, formulaVisual, ...rest }) => {
  const { facingMeta, children, trailingMeta } = node;
  const [first, last] = node.range;
  const formula = children.map((child) => child.formulaLine).join('\n');
  const editMode = getEditMode(node);

  return !editMode && !/^\s*$/.test(formula) ? (
    <LineGroup
      firstLineIndex={first + 1}
      lastLineIndex={trailingMeta ? last - 1 : last}
      data-styleid={BlockFormulaConstants.styleId}
    >
      <LineGroupIndent indentDepth={facingMeta.indentDepth} />
      <LineGroupContent indentDepth={facingMeta.indentDepth}>
        <KaTeX options={{ throwOnError: false, displayMode: true }}>{formula}</KaTeX>
      </LineGroupContent>
    </LineGroup>
  ) : (
    <LineGroup
      firstLineIndex={first + 1}
      lastLineIndex={trailingMeta ? last - 1 : last}
      data-styleid={BlockFormulaConstants.styleId}
    >
      <BlockFormulaMeta node={facingMeta} getEditMode={getEditMode} formulaVisual={formulaVisual} {...rest} />
      {children.map((child, index) => (
        <BlockFormulaLine key={index} node={child} getEditMode={getEditMode} formulaVisual={formulaVisual} {...rest} />
      ))}
      {trailingMeta && (
        <BlockFormulaMeta node={trailingMeta} getEditMode={getEditMode} formulaVisual={formulaVisual} {...rest} />
      )}
    </LineGroup>
  );
};
