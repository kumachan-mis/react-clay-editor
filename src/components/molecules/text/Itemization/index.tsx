import { ItemizationNode } from '../../../../parser/itemization/types';
import { ItemBullet } from '../../../atoms/text/ItemBullet';
import { ItemBulletContent } from '../../../atoms/text/ItemBulletContent';
import { Line } from '../../../atoms/text/Line';
import { LineContent } from '../../../atoms/text/LineContent';
import { LineIndent } from '../../../atoms/text/LineIndent';
import { TextNodeComponentProps } from '../common/types';

export type ItemizationProps = {
  readonly ChildComponent: React.FC<TextNodeComponentProps>;
} & TextNodeComponentProps<ItemizationNode>;

export const ItemizationConstants = {
  styleId: 'itemization',
};

export const Itemization: React.FC<ItemizationProps> = ({ node, editMode, textVisual, ChildComponent, ...rest }) => {
  const { lineIndex, indentDepth, bullet, contentLength, children } = node;
  const lineLength = indentDepth + bullet.length + contentLength;
  const lineProps = textVisual?.lineProps?.(lineIndex);

  return (
    <Line lineIndex={lineIndex} {...lineProps} data-styleid={ItemizationConstants.styleId}>
      <LineIndent indentDepth={indentDepth} lineIndex={lineIndex} />
      <ItemBullet bullet={bullet} indentDepth={indentDepth} lineIndex={lineIndex} />
      <LineContent indentDepth={indentDepth + 1} lineIndex={lineIndex} lineLength={lineLength}>
        <ItemBulletContent bullet={bullet} cursorOn={editMode} indentDepth={indentDepth} lineIndex={lineIndex} />
        {children.map((child, index) => (
          <ChildComponent editMode={editMode} key={index} node={child} textVisual={textVisual} {...rest} />
        ))}
      </LineContent>
    </Line>
  );
};
