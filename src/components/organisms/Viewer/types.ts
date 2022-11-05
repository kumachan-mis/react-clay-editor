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
} from '../../../common/types';

export type ViewerTextProps = TextVisual;

export type ViewerBracketLinkProps = BracketLinkVisual & BracketLinkParsing;

export type ViewerHashtagProps = HashtagVisual & HashtagParsing;

export type ViewerTaggedLinkProps = TaggedLinkVisual & TaggedLinkParsing;

export type ViewerCodeProps = CodeVisual & CodeParsing;

export type ViewerFormulaProps = FormulaVisual & FormulaParsing;

export type ViewerProps = {
  text: string;
  syntax?: 'bracket' | 'markdown';
  textProps?: ViewerTextProps;
  bracketLinkProps?: ViewerBracketLinkProps;
  hashtagProps?: ViewerHashtagProps;
  taggedLinkPropsMap?: { [tagName: string]: ViewerTaggedLinkProps };
  codeProps?: ViewerCodeProps;
  formulaProps?: ViewerFormulaProps;
};
