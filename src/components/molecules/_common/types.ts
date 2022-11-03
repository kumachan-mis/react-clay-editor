import {
  BracketLinkVisual,
  CodeVisual,
  FormulaVisual,
  HashtagVisual,
  TaggedLinkVisual,
  TextVisual,
} from '../../../common/types';
import { SyntaxNode } from '../../../parser/types';

export interface SyntaxNodeComponentProps<TSyntaxNode extends SyntaxNode = SyntaxNode> {
  node: TSyntaxNode;
  editMode: (node: SyntaxNode) => boolean;
  linkForceClickable: boolean;
  textVisual?: TextVisual;
  bracketLinkVisual?: BracketLinkVisual;
  hashtagVisual?: HashtagVisual;
  taggedLinkVisualMap?: { [tagName: string]: TaggedLinkVisual };
  codeVisual?: CodeVisual;
  formulaVisual?: FormulaVisual;
}
