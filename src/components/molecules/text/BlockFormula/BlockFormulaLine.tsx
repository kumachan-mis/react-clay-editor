import { BlockFormulaLineNode } from '../../../../parser/blockFormula/types';
import { Char } from '../../../atoms/text/Char';
import { Line } from '../../../atoms/text/Line';
import { LineIndent } from '../../../atoms/text/LineIndent';
import { Monospace } from '../../../atoms/text/Monospace';
import { MonospaceLineContent } from '../../../atoms/text/MonospaceLineContent';
import { TextNodeComponentProps } from '../common/types';

import React from 'react';

export type BlockFormulaLineProps = TextNodeComponentProps<BlockFormulaLineNode>;

const BlockFormulaLineComponent: React.FC<BlockFormulaLineProps> = ({ node, textVisual, formulaVisual }) => {
  const { formulaLine, lineIndex, indentDepth } = node;
  const lineLength = indentDepth + formulaLine.length;
  const lineProps = textVisual?.lineProps?.(lineIndex);
  const codeElementProps = formulaVisual?.codeProps?.(formulaLine);

  return (
    <Line lineIndex={lineIndex} {...lineProps}>
      <LineIndent indentDepth={indentDepth} lineIndex={lineIndex} />
      <MonospaceLineContent indentDepth={indentDepth} lineIndex={lineIndex} lineLength={lineLength}>
        <Monospace {...codeElementProps}>
          {[...formulaLine].map((char, index) => (
            <Char charIndex={indentDepth + index} key={indentDepth + index} lineIndex={lineIndex}>
              {char}
            </Char>
          ))}
        </Monospace>
      </MonospaceLineContent>
    </Line>
  );
};

function blockFormulaLineNodeEquals(a: BlockFormulaLineNode, b: BlockFormulaLineNode): boolean {
  return a.lineIndex === b.lineIndex && a.indentDepth === b.indentDepth && a.formulaLine === b.formulaLine;
}

export const BlockFormulaLine = React.memo(
  BlockFormulaLineComponent,
  (prev, next) =>
    blockFormulaLineNodeEquals(prev.node, next.node) &&
    prev.textVisual === next.textVisual &&
    prev.formulaVisual === next.formulaVisual
);
