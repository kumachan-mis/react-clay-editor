import { BlockCodeMetaNode, blockCodeMetaNodeEquals } from '../../../../parser/blockCode/blockCodeMetaNode';
import { Char } from '../../../atoms/text/Char';
import { Line } from '../../../atoms/text/Line';
import { LineIndent } from '../../../atoms/text/LineIndent';
import { Monospace } from '../../../atoms/text/Monospace';
import { MonospaceLineContent } from '../../../atoms/text/MonospaceLineContent';
import { TextNodeProps } from '../common/TextNodeProps';

import React from 'react';

export type BlockCodeMetaProps = TextNodeProps<BlockCodeMetaNode>;

const BlockCodeMetaComponent: React.FC<BlockCodeMetaProps> = ({ node, codeVisual }) => {
  const { lineIndex, indentDepth, codeMeta } = node;
  const lineLength = indentDepth + codeMeta.length;
  const codeElementProps = codeVisual?.codeProps?.(codeMeta);

  return (
    <Line lineIndex={lineIndex}>
      <LineIndent indentDepth={indentDepth} />
      <MonospaceLineContent indentDepth={indentDepth} lineLength={lineLength}>
        <Monospace {...codeElementProps}>
          {[...codeMeta].map((char, index) => (
            <Char charIndex={indentDepth + index} key={indentDepth + index}>
              {char}
            </Char>
          ))}
        </Monospace>
      </MonospaceLineContent>
    </Line>
  );
};

export const BlockCodeMeta = React.memo(
  BlockCodeMetaComponent,
  (prev, next) => blockCodeMetaNodeEquals(prev.node, next.node) && prev.codeVisual === next.codeVisual
);
