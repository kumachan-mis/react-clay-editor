import React from 'react';

import { BlockFormulaNode } from '../../../parser/types';
import { LineGroup } from '../../atoms/LineGroup';
import { TextNodeComponentProps } from '../_common/types';

import { BlockFormulaKaTeX } from './BlockFormulaKaTeX';
import { BlockFormulaLine } from './BlockFormulaLine';
import { BlockFormulaMeta } from './BlockFormulaMeta';

export type BlockFormulaProps = TextNodeComponentProps<BlockFormulaNode>;

export const BlockFormula: React.FC<BlockFormulaProps> = ({ node, editMode, formulaVisual, ...rest }) => {
  const { facingMeta, children, trailingMeta } = node;
  const [first, last] = node.range;
  const formula = children.map((child) => child.formulaLine).join('\n');
  const editModeValue = editMode(node);

  return !editModeValue && !/^\s*$/.test(formula) ? (
    <BlockFormulaKaTeX node={node} editMode={editMode} formulaVisual={formulaVisual} {...rest} />
  ) : (
    <LineGroup firstLineIndex={first + 1} lastLineIndex={trailingMeta ? last - 1 : last}>
      <BlockFormulaMeta node={facingMeta} editMode={editMode} formulaVisual={formulaVisual} {...rest} />
      {children.map((child, index) => (
        <BlockFormulaLine key={index} node={child} editMode={editMode} formulaVisual={formulaVisual} {...rest} />
      ))}
      {trailingMeta && (
        <BlockFormulaMeta node={trailingMeta} editMode={editMode} formulaVisual={formulaVisual} {...rest} />
      )}
    </LineGroup>
  );
};
