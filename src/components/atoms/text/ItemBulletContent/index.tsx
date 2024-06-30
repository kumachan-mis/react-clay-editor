import { Char } from '../Char';

import React from 'react';

export type ItemBulletContentProps = {
  readonly indentDepth: number;
  readonly bullet: string;
  readonly cursorOn: boolean;
};

const ItemBulletContentComponent: React.FC<ItemBulletContentProps> = ({ indentDepth, bullet, cursorOn }) => (
  <>
    {[...Array(bullet.length - 1).keys()].map((charIndex) => (
      <Char charIndex={indentDepth + charIndex + 1} key={indentDepth + charIndex + 1}>
        {cursorOn ? ' ' : ''}
      </Char>
    ))}
  </>
);

export const ItemBulletContent = React.memo(ItemBulletContentComponent);
