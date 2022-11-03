import React from 'react';

import {
  BracketLinkVisual,
  CodeVisual,
  FormulaVisual,
  HashtagVisual,
  TaggedLinkVisual,
  TextVisual,
} from '../common/types';
import { BlockCode } from '../components/molecules/BlockCode';
import { BlockFormula } from '../components/molecules/BlockFormula';
import { BracketLink } from '../components/molecules/BracketLink';
import { ContentFormula } from '../components/molecules/ContentFormula';
import { Decoration } from '../components/molecules/Decoration';
import { Hashtag } from '../components/molecules/Hashtag';
import { InlineCode } from '../components/molecules/InlineCode';
import { Itemization } from '../components/molecules/Itemization';
import { Normal } from '../components/molecules/Normal';
import { NormalLine } from '../components/molecules/NormalLine';
import { Quotation } from '../components/molecules/Quotation';
import { TaggedLink } from '../components/molecules/TaggedLink';
import { Url } from '../components/molecules/Url';
import { SyntaxNode } from '../parser/types';

export type SyntaxNodeComponentProps = {
  node: SyntaxNode;
  editMode: (node: SyntaxNode) => boolean;
  linkForceClickable: boolean;
  textVisual?: TextVisual;
  bracketLinkVisual?: BracketLinkVisual;
  hashtagVisual?: HashtagVisual;
  taggedLinkVisualMap?: { [tagName: string]: TaggedLinkVisual };
  codeVisual?: CodeVisual;
  formulaVisual?: FormulaVisual;
};

export const SyntaxNodeComponent: React.FC<SyntaxNodeComponentProps> = ({ node, ...rest }) => {
  switch (node.type) {
    case 'blockCode':
      return <BlockCode node={node} {...rest} />;
    case 'blockFormula':
      return <BlockFormula node={node} {...rest} />;
    case 'quotation':
      return <Quotation node={node} ChildComponent={SyntaxNodeComponent} {...rest} />;
    case 'itemization':
      return <Itemization node={node} ChildComponent={SyntaxNodeComponent} {...rest} />;
    case 'normalLine':
      return <NormalLine node={node} ChildComponent={SyntaxNodeComponent} {...rest} />;
    case 'inlineCode':
      return <InlineCode node={node} {...rest} />;
    case 'displayFormula':
      return <ContentFormula node={node} {...rest} />;
    case 'inlineFormula':
      return <ContentFormula node={node} {...rest} />;
    case 'decoration':
      return <Decoration node={node} ChildComponent={SyntaxNodeComponent} {...rest} />;
    case 'taggedLink':
      return <TaggedLink node={node} {...rest} />;
    case 'bracketLink':
      return <BracketLink node={node} {...rest} />;
    case 'hashtag':
      return <Hashtag node={node} {...rest} />;
    case 'url':
      return <Url node={node} {...rest} />;
    case 'normal':
      return <Normal node={node} {...rest} />;
    default:
      throw new Error(`unknown type of syntax node: ${node.type}`);
  }
};
