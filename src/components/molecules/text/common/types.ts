import { TextNode } from '../../../../parser';
import { BracketLinkVisual } from '../../../../types/visual/bracketLink';
import { CodeVisual } from '../../../../types/visual/code';
import { FormulaVisual } from '../../../../types/visual/formula';
import { HashtagVisual } from '../../../../types/visual/hashtag';
import { TaggedLinkVisual } from '../../../../types/visual/taggedLink';
import { TextVisual } from '../../../../types/visual/text';

export type TextNodeComponentProps<TTextNode extends TextNode = TextNode> = {
  node: TTextNode;
  editMode: (node: TextNode) => boolean;
  linkForceClickable: boolean;
  textVisual?: TextVisual;
  bracketLinkVisual?: BracketLinkVisual;
  hashtagVisual?: HashtagVisual;
  taggedLinkVisualMap?: { [tagName: string]: TaggedLinkVisual };
  codeVisual?: CodeVisual;
  formulaVisual?: FormulaVisual;
};
