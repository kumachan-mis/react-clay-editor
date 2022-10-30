import {
  TextVisual,
  BracketLinkVisual,
  HashtagVisual,
  TaggedLinkVisual,
  CodeVisual,
  FormulaVisual,
} from '../common/types';
import { CursorCoordinate } from '../components/molecules/Cursor/types';
import { TextSelection } from '../components/molecules/Selection/types';
import { Node } from '../parser/types';

export interface Props {
  nodes: Node[];
  cursorCoordinate?: CursorCoordinate;
  textSelection?: TextSelection;
  textVisual?: TextVisual;
  bracketLinkVisual?: BracketLinkVisual;
  hashtagVisual?: HashtagVisual;
  taggedLinkVisualMap?: { [tagName: string]: TaggedLinkVisual };
  codeVisual?: CodeVisual;
  formulaVisual?: FormulaVisual;
  className?: string;
  style?: React.CSSProperties;
}

export interface NodeProps<_Node extends Node = Node> {
  node: _Node;
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
