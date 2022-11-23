import {
  BracketLinkVisual,
  CodeVisual,
  FormulaVisual,
  HashtagVisual,
  TaggedLinkVisual,
  TextVisual,
} from '../../../../common/types';
import { TextNode } from '../../../../parser';
import { CursorCoordinate } from '../../cursor/Cursor/types';
import { CursorSelection } from '../../selection/Selection/types';

export type TextProps = {
  nodes: TextNode[];
  cursorCoordinate?: CursorCoordinate;
  cursorSelection?: CursorSelection;
  textVisual?: TextVisual;
  bracketLinkVisual?: BracketLinkVisual;
  hashtagVisual?: HashtagVisual;
  taggedLinkVisualMap?: { [tagName: string]: TaggedLinkVisual };
  codeVisual?: CodeVisual;
  formulaVisual?: FormulaVisual;
};
