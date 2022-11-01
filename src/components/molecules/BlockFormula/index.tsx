import React from 'react';

import { BlockFormulaNode } from '../../../parser/types';
import { LineGroup } from '../../atoms/LineGroup';
import { SyntaxNodeComponentProps } from '../_common/types';
import { cursorOnSyntaxNode } from '../_common/utils';

import { BlockFormulaKaTeX } from './BlockFormulaKaTeX';
import { BlockFormulaLine } from './BlockFormulaLine';
import { BlockFormulaMeta } from './BlockFormulaMeta';

export type BlockFormulaProps = SyntaxNodeComponentProps<BlockFormulaNode>;

export const BlockFormula: React.FC<BlockFormulaProps> = ({
  node,
  cursorCoordinate,
  textSelection,
  formulaVisual,
  ...rest
}) => {
  const { facingMeta, children, trailingMeta } = node;
  const [first, last] = node.range;
  const formula = children.map((child) => child.formulaLine).join('\n');
  const cursorOn = cursorOnSyntaxNode(node, cursorCoordinate, textSelection);

  return !cursorOn && !/^\s*$/.test(formula) ? (
    <BlockFormulaKaTeX
      node={node}
      cursorCoordinate={cursorCoordinate}
      textSelection={textSelection}
      formulaVisual={formulaVisual}
      {...rest}
    />
  ) : (
    <LineGroup firstLineIndex={first + 1} lastLineIndex={trailingMeta ? last - 1 : last}>
      <BlockFormulaMeta
        node={facingMeta}
        cursorCoordinate={cursorCoordinate}
        textSelection={textSelection}
        formulaVisual={formulaVisual}
        {...rest}
      />
      {children.map((child, index) => (
        <BlockFormulaLine
          key={index}
          node={child}
          cursorCoordinate={cursorCoordinate}
          textSelection={textSelection}
          formulaVisual={formulaVisual}
          {...rest}
        />
      ))}
      {trailingMeta && (
        <BlockFormulaMeta
          node={trailingMeta}
          cursorCoordinate={cursorCoordinate}
          textSelection={textSelection}
          formulaVisual={formulaVisual}
          {...rest}
        />
      )}
    </LineGroup>
  );
};
