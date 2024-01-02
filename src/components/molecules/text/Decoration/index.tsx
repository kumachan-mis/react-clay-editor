import { TextNode } from '../../../../parser';
import { DecorationNode, DecorationConfig } from '../../../../parser/decoration/types';
import { Char } from '../../../atoms/text/Char';
import { DecorationContent } from '../../../atoms/text/DecorationContent';
import { TextNodeComponentProps } from '../common/types';

export type DecorationProps = {
  readonly ChildComponent: React.FC<TextNodeComponentProps<TextNode>>;
} & TextNodeComponentProps<DecorationNode>;

export const DecorationConstants = {
  styleId: (config: DecorationConfig) => {
    let selctid = `decoration-${config.size}`;
    if (config.bold) selctid += '-bold';
    if (config.italic) selctid += '-italic';
    if (config.underline) selctid += '-underline';
    return selctid;
  },
};

export const Decoration: React.FC<DecorationProps> = ({ node, getEditMode, ChildComponent, ...rest }) => {
  const { lineIndex, facingMeta, config, trailingMeta, children } = node;
  const [first, last] = node.range;
  const editMode = getEditMode(node);

  return (
    <DecorationContent {...config} data-styleid={DecorationConstants.styleId(config)}>
      {[...facingMeta].map((char, index) => (
        <Char charIndex={first + index} key={first + index} lineIndex={lineIndex}>
          {editMode ? char : ''}
        </Char>
      ))}
      {children.map((child, index) => (
        <ChildComponent getEditMode={getEditMode} key={index} node={child} {...rest} />
      ))}
      {[...trailingMeta].map((char, index) => (
        <Char
          charIndex={last - (trailingMeta.length - 1) + index}
          key={last - (trailingMeta.length - 1) + index}
          lineIndex={lineIndex}
        >
          {editMode ? char : ''}
        </Char>
      ))}
    </DecorationContent>
  );
};
