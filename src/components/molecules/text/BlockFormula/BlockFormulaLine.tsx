import { BlockFormulaLineNode, blockFormulaLineNodeEquals } from '../../../../parser/blockFormula/blockFormulaLineNode';
import { Char } from '../../../atoms/text/Char';
import { Line } from '../../../atoms/text/Line';
import { LineIndent } from '../../../atoms/text/LineIndent';
import { Monospace } from '../../../atoms/text/Monospace';
import { MonospaceLineContent } from '../../../atoms/text/MonospaceLineContent';
import { TextNodeProps } from '../common/TextNodeProps';

import React from 'react';

export type BlockFormulaLineProps = TextNodeProps<BlockFormulaLineNode>;

const BlockFormulaLineComponent: React.FC<BlockFormulaLineProps> = ({ node, textVisual, formulaVisual }) => {
  const { formulaLine, lineIndex, indentDepth } = node;
  const lineLength = indentDepth + formulaLine.length;
  const lineProps = textVisual?.lineProps?.(lineIndex);
  const codeElementProps = formulaVisual?.codeProps?.(formulaLine);

  return (
    <Line lineIndex={lineIndex} {...lineProps}>
      <LineIndent indentDepth={indentDepth} />
      <MonospaceLineContent indentDepth={indentDepth} lineLength={lineLength}>
        <Monospace {...codeElementProps}>
          {[...formulaLine].map((char, index) => (
            <Char charIndex={indentDepth + index} key={indentDepth + index}>
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
  (prev, next) =>
    blockFormulaLineNodeEquals(prev.node, next.node) &&
    prev.textVisual === next.textVisual &&
    prev.formulaVisual === next.formulaVisual
);
