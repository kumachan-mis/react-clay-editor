import React from 'react';

import {
  BracketLinkVisual,
  CodeVisual,
  FormulaVisual,
  HashtagVisual,
  TaggedLinkVisual,
  TextVisual,
} from '../../../../common/types';
import { TextNode } from '../../../../parser/types';
import { BlockCode } from '../BlockCode';
import { BlockFormula } from '../BlockFormula';
import { BracketLink } from '../BracketLink';
import { ContentFormula } from '../ContentFormula';
import { Decoration } from '../Decoration';
import { Hashtag } from '../Hashtag';
import { InlineCode } from '../InlineCode';
import { Itemization } from '../Itemization';
import { Normal } from '../Normal';
import { NormalLine } from '../NormalLine';
import { Quotation } from '../Quotation';
import { TaggedLink } from '../TaggedLink';
import { Url } from '../Url';

export type TextNodeComponentProps = {
  node: TextNode;
  editMode: (node: TextNode) => boolean;
  linkForceClickable: boolean;
  textVisual?: TextVisual;
  bracketLinkVisual?: BracketLinkVisual;
  hashtagVisual?: HashtagVisual;
  taggedLinkVisualMap?: { [tagName: string]: TaggedLinkVisual };
  codeVisual?: CodeVisual;
  formulaVisual?: FormulaVisual;
};

export const TextNodeComponent: React.FC<TextNodeComponentProps> = ({ node, ...rest }) => {
  switch (node.type) {
    case 'blockCode':
      return <BlockCode node={node} {...rest} />;
    case 'blockFormula':
      return <BlockFormula node={node} {...rest} />;
    case 'quotation':
      return <Quotation node={node} ChildComponent={TextNodeComponent} {...rest} />;
    case 'itemization':
      return <Itemization node={node} ChildComponent={TextNodeComponent} {...rest} />;
    case 'normalLine':
      return <NormalLine node={node} ChildComponent={TextNodeComponent} {...rest} />;
    case 'inlineCode':
      return <InlineCode node={node} {...rest} />;
    case 'displayFormula':
      return <ContentFormula node={node} {...rest} />;
    case 'inlineFormula':
      return <ContentFormula node={node} {...rest} />;
    case 'decoration':
      return <Decoration node={node} ChildComponent={TextNodeComponent} {...rest} />;
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
