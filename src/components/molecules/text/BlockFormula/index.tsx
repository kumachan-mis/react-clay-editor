import React from 'react';

import { BlockFormulaNode } from '../../../../parser/blockFormula/types';
import { LineGroup } from '../../../atoms/text/LineGroup';
import { TextNodeComponentProps } from '../common/types';

import { BlockFormulaKaTeX } from './BlockFormulaKaTeX';
import { BlockFormulaLine } from './BlockFormulaLine';
import { BlockFormulaMeta } from './BlockFormulaMeta';

export type BlockFormulaProps = TextNodeComponentProps<BlockFormulaNode>;

export const BlockFormula: React.FC<BlockFormulaProps> = ({ node, getEditMode, formulaVisual, ...rest }) => {
  const { facingMeta, children, trailingMeta } = node;
  const [first, last] = node.range;
  const formula = children.map((child) => child.formulaLine).join('\n');
  const editMode = getEditMode(node);

  return !editMode && !/^\s*$/.test(formula) ? (
    <BlockFormulaKaTeX node={node} getEditMode={getEditMode} formulaVisual={formulaVisual} {...rest} />
  ) : (
    <LineGroup firstLineIndex={first + 1} lastLineIndex={trailingMeta ? last - 1 : last}>
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
