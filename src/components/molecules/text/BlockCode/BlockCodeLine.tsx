import { BlockCodeLineNode, blockCodeLineNodeEquals } from '../../../../parser/blockCode/blockCodeLineNode';
import { Char } from '../../../atoms/text/Char';
import { Line } from '../../../atoms/text/Line';
import { LineIndent } from '../../../atoms/text/LineIndent';
import { Monospace } from '../../../atoms/text/Monospace';
import { MonospaceLineContent } from '../../../atoms/text/MonospaceLineContent';
import { TextNodeProps } from '../common/TextNodeProps';

import React from 'react';

export type BlockCodeLineProps = TextNodeProps<BlockCodeLineNode>;

const BlockCodeLineComponent: React.FC<BlockCodeLineProps> = ({ node, codeVisual }) => {
  const { codeLine, lineId, indent } = node;

  const lineLength = indent.length + codeLine.length;
  const codeElementProps = codeVisual?.codeProps?.(codeLine);

  return (
    <Line lineId={lineId}>
      <LineIndent indentDepth={indent.length} />
      <MonospaceLineContent indentDepth={indent.length} lineLength={lineLength}>
        <Monospace {...codeElementProps}>
          {[...codeLine].map((char, index) => (
            <Char charIndex={indent.length + index} key={indent.length + index}>
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
  (prev, next) => blockCodeLineNodeEquals(prev.node, next.node) && prev.codeVisual === next.codeVisual
);
