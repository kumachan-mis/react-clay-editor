import { Node } from './parser/types';
import { BracketLinkProps, HashTagProps, TaggedLinkProps, CodeProps, FormulaProps } from '../Editor/types';
import { CursorCoordinate } from '../Cursor/types';

export interface Props {
  text: string;
  syntax?: 'bracket' | 'markdown';
  cursorCoordinate?: CursorCoordinate;
  decorationSettings?: DecorationSettings;
  bracketLinkProps?: BracketLinkProps;
  hashTagProps?: HashTagProps;
  taggedLinkPropsMap?: TaggedLinkPropsMap;
  codeProps?: CodeProps;
  formulaProps?: FormulaProps;
  style?: React.CSSProperties;
}

export interface NodeProps {
  node: Node;
  decorationSettings: DecorationSettings;
  bracketLinkProps: BracketLinkProps;
  hashTagProps: HashTagProps;
  taggedLinkPropsMap: TaggedLinkPropsMap;
  codeProps: CodeProps;
  formulaProps: FormulaProps;
  curcorLineIndex: number | undefined;
}

export interface DecorationSettings {
  fontSizes: Record<'normal' | 'larger' | 'largest', number>;
}

export type TaggedLinkPropsMap = { [tagName: string]: TaggedLinkProps };
