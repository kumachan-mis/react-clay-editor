import { BlockFormulaNode, blockFormulaNodeEquals } from '../../../../parser/blockFormula/blockFormulaNode';
import { KaTeX } from '../../../atoms/text/KaTeX';
import { LineGroup } from '../../../atoms/text/LineGroup';
import { LineGroupContent } from '../../../atoms/text/LineGroupContent';
import { LineGroupIndent } from '../../../atoms/text/LineGroupIndent';
import { TextNodeProps, createTextNodePropsEquals } from '../common/TextNodeProps';

import { BlockFormulaLine } from './BlockFormulaLine';
import { BlockFormulaMeta } from './BlockFormulaMeta';

import React from 'react';

export type BlockFormulaProps = TextNodeProps<BlockFormulaNode>;

export const BlockFormulaConstants = {
  styleId: 'block-formula',
};

const BlockFormulaComponent: React.FC<BlockFormulaProps> = ({ node, editMode, formulaVisual, ...rest }) => {
  const { facingMeta, children, trailingMeta } = node;
  const formula = children.map((child) => child.formulaLine).join('\n');

  const firstNode = children.length > 0 ? children[0] : facingMeta;
  const lastNode = children.length > 0 ? children[children.length - 1] : trailingMeta ?? facingMeta;

  return !editMode && !/^\s*$/.test(formula) ? (
    <LineGroup data-styleid={BlockFormulaConstants.styleId} firstLineId={firstNode.lineId} lastLineId={lastNode.lineId}>
      <LineGroupIndent indentDepth={facingMeta.indent.length} />
      <LineGroupContent indentDepth={facingMeta.indent.length}>
        <KaTeX displayMode>{formula}</KaTeX>
      </LineGroupContent>
    </LineGroup>
  ) : (
    <LineGroup data-styleid={BlockFormulaConstants.styleId} firstLineId={firstNode.lineId} lastLineId={lastNode.lineId}>
      <BlockFormulaMeta editMode={editMode} formulaVisual={formulaVisual} node={facingMeta} {...rest} />
      {children.map((child) => (
        <BlockFormulaLine editMode={editMode} formulaVisual={formulaVisual} key={child.lineId} node={child} {...rest} />
      ))}
      {trailingMeta && (
        <BlockFormulaMeta editMode={editMode} formulaVisual={formulaVisual} node={trailingMeta} {...rest} />
      )}
    </LineGroup>
  );
};

export const BlockFormula = React.memo(BlockFormulaComponent, createTextNodePropsEquals(blockFormulaNodeEquals));
