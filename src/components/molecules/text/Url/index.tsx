import { UrlNode } from '../../../../parser/url/types';
import { Char } from '../../../atoms/text/Char';
import { EmbededLink } from '../../../atoms/text/EmbededLink';
import { TextNodeComponentProps } from '../common/types';

export type UrlProps = TextNodeComponentProps<UrlNode>;

export const UrlConstants = {
  styleId: 'url',
};

export const Url: React.FC<UrlProps> = ({ node, getEditMode, linkForceClickable }) => {
  const { lineIndex, url } = node;
  const [first] = node.range;
  const editMode = getEditMode(node);

  return (
    <EmbededLink
      anchorProps={() => ({ href: url, target: '_blank', rel: 'noopener noreferrer' })}
      data-styleid={UrlConstants.styleId}
      editMode={editMode}
      forceClickable={linkForceClickable}
    >
      {[...url].map((char, index) => (
        <Char charIndex={first + index} key={first + index} lineIndex={lineIndex}>
          {char}
        </Char>
      ))}
    </EmbededLink>
  );
};
