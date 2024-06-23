import { BlockFormulaMetaNode, blockFormulaMetaNodeEquals } from '../../../../parser/blockFormula/blockFormulaMetaNode';
import { Char } from '../../../atoms/text/Char';
import { Line } from '../../../atoms/text/Line';
import { LineIndent } from '../../../atoms/text/LineIndent';
import { Monospace } from '../../../atoms/text/Monospace';
import { MonospaceLineContent } from '../../../atoms/text/MonospaceLineContent';
import { TextNodeProps } from '../common/TextNodeProps';

import React from 'react';

export type BlockFormulaMetaProps = TextNodeProps<BlockFormulaMetaNode>;

const BlockFormulaMetaComponent: React.FC<BlockFormulaMetaProps> = ({ node, formulaVisual }) => {
  const { formulaMeta, lineIndex, indentDepth } = node;
  const lineLength = indentDepth + formulaMeta.length;
  const codeElementProps = formulaVisual?.codeProps?.(formulaMeta);

  return (
    <Line lineIndex={lineIndex}>
      <LineIndent indentDepth={indentDepth} />
      <MonospaceLineContent indentDepth={indentDepth} lineLength={lineLength}>
        <Monospace {...codeElementProps}>
          {[...formulaMeta].map((char, index) => (
            <Char charIndex={indentDepth + index} key={indentDepth + index}>
              {char}
            </Char>
          ))}
        </Monospace>
      </MonospaceLineContent>
    </Line>
  );
};

export const BlockFormulaMeta = React.memo(
  BlockFormulaMetaComponent,
  (prev, next) => blockFormulaMetaNodeEquals(prev.node, next.node) && prev.formulaVisual === next.formulaVisual
);
