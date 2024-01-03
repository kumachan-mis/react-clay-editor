import { HashtagNode } from '../../../../parser/hashtag/types';
import { getHashtagName } from '../../../../parser/hashtag/utils';
import { Char } from '../../../atoms/text/Char';
import { EmbededLink } from '../../../atoms/text/EmbededLink';
import { TextNodeComponentProps } from '../common/types';

export type HashtagProps = TextNodeComponentProps<HashtagNode>;

export const HashtagConstants = {
  styleId: 'hashtag',
};

export const Hashtag: React.FC<HashtagProps> = ({ node, getEditMode, linkForceClickable, hashtagVisual }) => {
  const { lineIndex, facingMeta, linkName, trailingMeta } = node;
  const [first] = node.range;
  const editMode = getEditMode(node);

  return (
    <EmbededLink
      anchorProps={(clickable) => hashtagVisual?.anchorProps?.(getHashtagName(node), clickable)}
      data-styleid={HashtagConstants.styleId}
      editMode={editMode}
      forceClickable={linkForceClickable}
    >
      {[...facingMeta, ...linkName, ...trailingMeta].map((char, index) => (
        <Char charIndex={first + index} key={first + index} lineIndex={lineIndex}>
          {char}
        </Char>
      ))}
    </EmbededLink>
  );
};
