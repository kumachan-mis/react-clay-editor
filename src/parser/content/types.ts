import { BracketLinkNode } from '../bracketLink/types';
import { DecorationNode } from '../decoration/types';
import { DisplayFormulaNode } from '../displayFormula/types';
import { HashtagNode } from '../hashtag/types';
import { InlineCodeNode } from '../inlineCode/types';
import { InlineFormulaNode } from '../inlineFormula/types';
import { NormalNode } from '../normal/types';
import { TaggedLinkNode } from '../taggedLink/types';
import { UrlNode } from '../url/types';

export type ContentNode = InlineCodeNode | ContentFormulaNode | DecorationNode | StyledLinkNode | TextLikeNode;

export type ContentFormulaNode = DisplayFormulaNode | InlineFormulaNode;

export type StyledLinkNode = TaggedLinkNode | BracketLinkNode | HashtagNode;

export type TextLikeNode = UrlNode | NormalNode;
