import React from 'react';

import { Char } from '../Char';

export type ItemBulletContentProps = {
  lineIndex: number;
  indentDepth: number;
  bullet: string;
  cursorOn: boolean;
};

export const ItemBulletContent: React.FC<ItemBulletContentProps> = ({ lineIndex, indentDepth, bullet, cursorOn }) => (
  <>
    {[...Array(bullet.length - 1).keys()].map((charIndex) => (
      <Char key={indentDepth + charIndex + 1} lineIndex={lineIndex} charIndex={indentDepth + charIndex + 1}>
        {cursorOn ? ' ' : ''}
      </Char>
    ))}
  </>
);
