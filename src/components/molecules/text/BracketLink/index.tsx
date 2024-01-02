import { BracketLinkNode } from '../../../../parser/bracketLink/types';
import { Char } from '../../../atoms/text/Char';
import { EmbededLink } from '../../../atoms/text/EmbededLink';
import { TextNodeComponentProps } from '../common/types';

export type BracketLinkProps = TextNodeComponentProps<BracketLinkNode>;

export const BracketLinkConstants = {
  styleId: 'bracket-link',
};

export const BracketLink: React.FC<BracketLinkProps> = ({
  node,
  getEditMode,
  linkForceClickable,
  bracketLinkVisual,
}) => {
  const { lineIndex, facingMeta, linkName, trailingMeta } = node;
  const [first, last] = node.range;
  const editMode = getEditMode(node);

  return (
    <EmbededLink
      anchorProps={(clickable) => bracketLinkVisual?.anchorProps?.(linkName, clickable)}
      data-styleid={BracketLinkConstants.styleId}
      editMode={editMode}
      forceClickable={linkForceClickable}
    >
      {[...facingMeta].map((char, index) => (
        <Char charIndex={first + index} key={first + index} lineIndex={lineIndex}>
          {editMode ? char : ''}
        </Char>
      ))}
      {[...linkName].map((char, index) => (
        <Char
          charIndex={first + facingMeta.length + index}
          key={first + facingMeta.length + index}
          lineIndex={lineIndex}
        >
          {char}
        </Char>
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
    </EmbededLink>
  );
};
