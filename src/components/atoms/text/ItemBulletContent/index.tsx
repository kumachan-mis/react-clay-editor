import { Char } from '../Char';

export type ItemBulletContentProps = {
  readonly lineIndex: number;
  readonly indentDepth: number;
  readonly bullet: string;
  readonly cursorOn: boolean;
};

export const ItemBulletContent: React.FC<ItemBulletContentProps> = ({ lineIndex, indentDepth, bullet, cursorOn }) => (
  <>
    {[...Array(bullet.length - 1).keys()].map((charIndex) => (
      <Char charIndex={indentDepth + charIndex + 1} key={indentDepth + charIndex + 1} lineIndex={lineIndex}>
        {cursorOn ? ' ' : ''}
      </Char>
    ))}
  </>
);
