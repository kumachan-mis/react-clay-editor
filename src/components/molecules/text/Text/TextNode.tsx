import { textNodeEquals } from '../../../../parser';
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
import { TextNodeProps, createTextNodePropsEquals } from '../common/TextNodeProps';

import React from 'react';

const TextNodeComponent: React.FC<TextNodeProps> = ({ node, ...rest }) => {
  switch (node.type) {
    case 'blockCode':
      return <BlockCode node={node} {...rest} />;
    case 'blockFormula':
      return <BlockFormula node={node} {...rest} />;
    case 'quotation':
      return <Quotation ChildComponent={TextNode} node={node} {...rest} />;
    case 'itemization':
      return <Itemization ChildComponent={TextNode} node={node} {...rest} />;
    case 'normalLine':
      return <NormalLine ChildComponent={TextNode} node={node} {...rest} />;
    case 'inlineCode':
      return <InlineCode node={node} {...rest} />;
    case 'displayFormula':
      return <ContentFormula node={node} {...rest} />;
    case 'inlineFormula':
      return <ContentFormula node={node} {...rest} />;
    case 'decoration':
      return <Decoration ChildComponent={TextNode} node={node} {...rest} />;
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

export const TextNode: React.FC<TextNodeProps> = React.memo(
  TextNodeComponent,
  createTextNodePropsEquals(textNodeEquals)
);
