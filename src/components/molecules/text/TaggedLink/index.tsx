import { TaggedLinkNode } from '../../../../parser/taggedLink/types';
import { getTagName, splitTag } from '../../../../parser/taggedLink/utils';
import { Char } from '../../../atoms/text/Char';
import { EmbededLink } from '../../../atoms/text/EmbededLink';
import { TextNodeComponentProps } from '../common/types';

export type TaggedLinkProps = TextNodeComponentProps<TaggedLinkNode>;

export const TaggedLinkConstants = {
  styleId: (tagName: string) => `${tagName}-tagged-link`,
};

export const TaggedLink: React.FC<TaggedLinkProps> = ({
  node,
  getEditMode,
  linkForceClickable,
  taggedLinkVisualMap,
}) => {
  const { lineIndex, linkName, trailingMeta } = node;
  const [facingMeta, tag] = splitTag(node);
  const tagName = getTagName(node);
  const [first, last] = node.range;
  const editMode = getEditMode(node);
  const taggedLinkVisual = taggedLinkVisualMap?.[tagName];

  return (
    <EmbededLink
      anchorProps={(clickable) => taggedLinkVisual?.anchorProps?.(linkName, clickable)}
      data-styleid={TaggedLinkConstants.styleId(tagName)}
      editMode={editMode}
      forceClickable={linkForceClickable}
    >
      {[...facingMeta].map((char, index) => (
        <Char charIndex={first + index} key={first + index} lineIndex={lineIndex}>
          {editMode ? char : ''}
        </Char>
      ))}
      {[...tag].map((char, index) => (
        <Char
          charIndex={first + facingMeta.length + index}
          key={first + facingMeta.length + index}
          lineIndex={lineIndex}
        >
          {editMode || !taggedLinkVisual?.tagHidden ? char : ''}
        </Char>
      ))}
      {[...linkName].map((char, index) => (
        <Char
          charIndex={first + facingMeta.length + tag.length + index}
          key={first + facingMeta.length + tag.length + index}
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
