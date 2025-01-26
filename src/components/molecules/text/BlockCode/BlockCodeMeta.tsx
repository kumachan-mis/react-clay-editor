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
  const { lineId, indent, codeMeta } = node;
  const lineLength = indent.length + codeMeta.length;
  const codeElementProps = codeVisual?.codeProps?.(codeMeta);

  return (
    <Line lineId={lineId}>
      <LineIndent indentDepth={indent.length} />
      <MonospaceLineContent indentDepth={indent.length} lineLength={lineLength}>
        <Monospace {...codeElementProps}>
          {codeMeta.split('').map((char, index) => (
            <Char charIndex={indent.length + index} key={indent.length + index}>
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
  (prev, next) => blockCodeMetaNodeEquals(prev.node, next.node) && prev.codeVisual === next.codeVisual,
);
