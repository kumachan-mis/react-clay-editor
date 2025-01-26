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
  const { formulaMeta, lineId, indent } = node;
  const lineLength = indent.length + formulaMeta.length;
  const codeElementProps = formulaVisual?.codeProps?.(formulaMeta);

  return (
    <Line lineId={lineId}>
      <LineIndent indentDepth={indent.length} />
      <MonospaceLineContent indentDepth={indent.length} lineLength={lineLength}>
        <Monospace {...codeElementProps}>
          {formulaMeta.split('').map((char, index) => (
            <Char charIndex={indent.length + index} key={indent.length + index}>
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
  (prev, next) => blockFormulaMetaNodeEquals(prev.node, next.node) && prev.formulaVisual === next.formulaVisual,
);
