import {
  BracketLinkVisual,
  CodeVisual,
  FormulaVisual,
  HashtagVisual,
  TaggedLinkVisual,
  TextVisual,
} from '../../../common/types';
import { SyntaxNode } from '../../../parser/types';
import { CursorCoordinate } from '../Cursor/types';
import { TextSelection } from '../Selection/types';

export interface SyntaxNodeComponentProps<TSyntaxNode extends SyntaxNode = SyntaxNode> {
  node: TSyntaxNode;
  cursorCoordinate?: CursorCoordinate;
  textSelection?: TextSelection;
  textVisual?: TextVisual;
  bracketLinkVisual?: BracketLinkVisual;
  hashtagVisual?: HashtagVisual;
  taggedLinkVisualMap?: { [tagName: string]: TaggedLinkVisual };
  codeVisual?: CodeVisual;
  formulaVisual?: FormulaVisual;
  linkForceClickable: boolean;
}
