import {
  BracketLinkVisual,
  CodeVisual,
  FormulaVisual,
  HashtagVisual,
  TaggedLinkVisual,
  TextVisual,
} from '../../../common/types';
import { TextNode } from '../../../parser/types';
import { CursorCoordinate } from '../../molecules/cursor/Cursor/types';
import { TextSelection } from '../../molecules/selection/Selection/types';

export type TextProps = {
  nodes: TextNode[];
  cursorCoordinate?: CursorCoordinate;
  textSelection?: TextSelection;
  textVisual?: TextVisual;
  bracketLinkVisual?: BracketLinkVisual;
  hashtagVisual?: HashtagVisual;
  taggedLinkVisualMap?: { [tagName: string]: TaggedLinkVisual };
  codeVisual?: CodeVisual;
  formulaVisual?: FormulaVisual;
  className?: string;
};
