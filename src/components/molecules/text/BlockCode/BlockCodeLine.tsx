import { BlockCodeLineNode, blockCodeLineNodeEquals } from '../../../../parser/blockCode/blockCodeLineNode';
import { Char } from '../../../atoms/text/Char';
import { Line } from '../../../atoms/text/Line';
import { LineIndent } from '../../../atoms/text/LineIndent';
import { Monospace } from '../../../atoms/text/Monospace';
import { MonospaceLineContent } from '../../../atoms/text/MonospaceLineContent';
import { TextNodeProps } from '../common/TextNodeProps';

import React from 'react';

export type BlockCodeLineProps = TextNodeProps<BlockCodeLineNode>;

const BlockCodeLineComponent: React.FC<BlockCodeLineProps> = ({ node, textVisual, codeVisual }) => {
  const { codeLine, lineIndex, indentDepth } = node;

  const lineLength = indentDepth + codeLine.length;
  const lineProps = textVisual?.lineProps?.(lineIndex);
  const codeElementProps = codeVisual?.codeProps?.(codeLine);

  return (
    <Line lineIndex={lineIndex} {...lineProps}>
      <LineIndent indentDepth={indentDepth} />
      <MonospaceLineContent indentDepth={indentDepth} lineLength={lineLength}>
        <Monospace {...codeElementProps}>
          {[...codeLine].map((char, index) => (
            <Char charIndex={indentDepth + index} key={indentDepth + index}>
              {char}
            </Char>
          ))}
        </Monospace>
      </MonospaceLineContent>
    </Line>
  );
};

export const BlockCodeLine = React.memo(
  BlockCodeLineComponent,
  (prev, next) =>
    blockCodeLineNodeEquals(prev.node, next.node) &&
    prev.textVisual === next.textVisual &&
    prev.codeVisual === next.codeVisual
);
