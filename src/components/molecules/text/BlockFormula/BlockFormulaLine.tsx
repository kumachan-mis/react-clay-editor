import { BlockFormulaLineNode, blockFormulaLineNodeEquals } from '../../../../parser/blockFormula/blockFormulaLineNode';
import { Char } from '../../../atoms/text/Char';
import { Line } from '../../../atoms/text/Line';
import { LineIndent } from '../../../atoms/text/LineIndent';
import { Monospace } from '../../../atoms/text/Monospace';
import { MonospaceLineContent } from '../../../atoms/text/MonospaceLineContent';
import { TextNodeProps } from '../common/TextNodeProps';

import React from 'react';

export type BlockFormulaLineProps = TextNodeProps<BlockFormulaLineNode>;

const BlockFormulaLineComponent: React.FC<BlockFormulaLineProps> = ({ node, formulaVisual }) => {
  const { formulaLine, lineId, indent } = node;
  const lineLength = indent.length + formulaLine.length;
  const codeElementProps = formulaVisual?.codeProps?.(formulaLine);

  return (
    <Line lineId={lineId}>
      <LineIndent indentDepth={indent.length} />
      <MonospaceLineContent indentDepth={indent.length} lineLength={lineLength}>
        <Monospace {...codeElementProps}>
          {formulaLine.split('').map((char, index) => (
            <Char charIndex={indent.length + index} key={indent.length + index}>
              {char}
            </Char>
          ))}
        </Monospace>
      </MonospaceLineContent>
    </Line>
  );
};

export const BlockFormulaLine = React.memo(
  BlockFormulaLineComponent,
  (prev, next) => blockFormulaLineNodeEquals(prev.node, next.node) && prev.formulaVisual === next.formulaVisual,
);
