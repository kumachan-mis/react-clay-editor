import { CursorCoordinate } from '../Cursor/types';
import {
  TextVisual,
  BracketLinkVisual,
  HashtagVisual,
  TaggedLinkVisual,
  CodeVisual,
  FormulaVisual,
} from '../common/types';
import { Node } from '../parser/types';

export interface Props {
  nodes: Node[];
  cursorCoordinate?: CursorCoordinate;
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
  bracketLinkVisual?: BracketLinkVisual;
  hashtagVisual?: HashtagVisual;
  taggedLinkVisualMap?: { [tagName: string]: TaggedLinkVisual };
  codeVisual?: CodeVisual;
  formulaVisual?: FormulaVisual;
  cursorLineIndex: number | undefined;
  linkForceActive: boolean;
}
