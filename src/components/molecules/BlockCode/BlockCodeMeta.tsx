import React from 'react';

import { BlockCodeMetaNode } from '../../../parser/types';
import { Char } from '../../atoms/Char';
import { Line } from '../../atoms/Line';
import { LineIndent } from '../../atoms/LineIndent';
import { Monospace } from '../../atoms/Monospace';
import { SyntaxNodeComponentProps } from '../_common/types';

import { BlockCodeContent } from './BlockCodeContent';

export type BlockCodeMetaProps = SyntaxNodeComponentProps<BlockCodeMetaNode>;

export const BlockCodeMeta: React.FC<BlockCodeMetaProps> = ({ node, textVisual, codeVisual }) => {
  const { lineIndex, indentDepth, codeMeta } = node;
  const lineLength = indentDepth + codeMeta.length;
  const lineProps = textVisual?.lineProps?.(lineIndex);
  const codeElementProps = codeVisual?.codeProps?.(codeMeta);

  return (
    <Line lineIndex={lineIndex} {...lineProps}>
      <LineIndent lineIndex={lineIndex} indentDepth={indentDepth} />
      <BlockCodeContent lineIndex={lineIndex} indentDepth={indentDepth} lineLength={lineLength}>
        <Monospace {...codeElementProps}>
          {[...codeMeta].map((char, index) => (
            <Char key={indentDepth + index} lineIndex={lineIndex} charIndex={indentDepth + index}>
              {char}
            </Char>
          ))}
        </Monospace>
      </BlockCodeContent>
    </Line>
  );
};
