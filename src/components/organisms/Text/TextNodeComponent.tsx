import React from 'react';

import {
  BracketLinkVisual,
  CodeVisual,
  FormulaVisual,
  HashtagVisual,
  TaggedLinkVisual,
  TextVisual,
} from '../../../common/types';
import { TextNode } from '../../../parser/types';
import { BlockCode } from '../../molecules/text/BlockCode';
import { BlockFormula } from '../../molecules/text/BlockFormula';
import { BracketLink } from '../../molecules/text/BracketLink';
import { ContentFormula } from '../../molecules/text/ContentFormula';
import { Decoration } from '../../molecules/text/Decoration';
import { Hashtag } from '../../molecules/text/Hashtag';
import { InlineCode } from '../../molecules/text/InlineCode';
import { Itemization } from '../../molecules/text/Itemization';
import { Normal } from '../../molecules/text/Normal';
import { NormalLine } from '../../molecules/text/NormalLine';
import { Quotation } from '../../molecules/text/Quotation';
import { TaggedLink } from '../../molecules/text/TaggedLink';
import { Url } from '../../molecules/text/Url';

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
