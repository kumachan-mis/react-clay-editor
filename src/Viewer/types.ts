import {
  TextVisual,
  BracketLinkVisual,
  HashtagVisual,
  TaggedLinkVisual,
  CodeVisual,
  FormulaVisual,
  BracketLinkParsing,
  HashtagParsing,
  TaggedLinkParsing,
  CodeParsing,
  FormulaParsing,
} from '../common/types';

export interface Props {
  text: string;
  header?: string;
  syntax?: 'bracket' | 'markdown';
  textProps?: TextProps;
  bracketLinkProps?: BracketLinkProps;
  hashtagProps?: HashtagProps;
  taggedLinkPropsMap?: { [tagName: string]: TaggedLinkProps };
  codeProps?: CodeProps;
  formulaProps?: FormulaProps;
  className?: string;
  style?: React.CSSProperties;
}

export type TextProps = TextVisual;

export type BracketLinkProps = BracketLinkVisual & BracketLinkParsing;

export type HashtagProps = HashtagVisual & HashtagParsing;

export type TaggedLinkProps = TaggedLinkVisual & TaggedLinkParsing;

export type CodeProps = CodeVisual & CodeParsing;

export type FormulaProps = FormulaVisual & FormulaParsing;
