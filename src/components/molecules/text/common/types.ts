import { TextNode } from 'src/parser';
import { BracketLinkVisual } from 'src/types/visual/bracketLink';
import { CodeVisual } from 'src/types/visual/code';
import { FormulaVisual } from 'src/types/visual/formula';
import { HashtagVisual } from 'src/types/visual/hashtag';
import { TaggedLinkVisual } from 'src/types/visual/taggedLink';
import { TextVisual } from 'src/types/visual/text';

export type TextNodeComponentProps<TTextNode extends TextNode = TextNode> = {
  node: TTextNode;
  getEditMode: (node: TextNode) => boolean;
  linkForceClickable: boolean;
  textVisual?: TextVisual;
  bracketLinkVisual?: BracketLinkVisual;
  hashtagVisual?: HashtagVisual;
  taggedLinkVisualMap?: { [tagName: string]: TaggedLinkVisual };
  codeVisual?: CodeVisual;
  formulaVisual?: FormulaVisual;
};
