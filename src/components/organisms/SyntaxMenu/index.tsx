import * as React from 'react';

import { MenuList } from '../../atoms/menu/MenuList';
import { BoldMenu } from '../../molecules/menu/BoldMenu';
import { BracketMenu } from '../../molecules/menu/BracketMenu';
import { CodeMenu } from '../../molecules/menu/CodeMenu';
import { FormulaMenu } from '../../molecules/menu/FormulaMenu';
import { HashtagMenu } from '../../molecules/menu/HashtagMenu';
import { ItalicMenu } from '../../molecules/menu/ItalicMenu';
import { ItemizationMenu } from '../../molecules/menu/ItemizationMenu';
import { QuotationMenu } from '../../molecules/menu/QuotationMenu';
import { SectionMenu } from '../../molecules/menu/SectionMenu';
import { TaggedLinkMenu } from '../../molecules/menu/TaggedLinkMenu';
import { UnderlineMenu } from '../../molecules/menu/UnderlineMenu';
import { useBlockPosition } from '../../molecules/menu/hooks/block';
import { useContentPosition } from '../../molecules/menu/hooks/content';

import { useLineNodes } from './hooks';
import { SyntaxMenuProps } from './types';

export const SyntaxMenu: React.FC<SyntaxMenuProps> = ({
  nodes,
  section,
  itemization,
  bracket,
  hashtag,
  taggedLink,
  code,
  formula,
  quotation,
  listProps,
  ...common
}) => {
  const lineNodes = useLineNodes(nodes);
  const contentPosition = useContentPosition(lineNodes, common.state.cursorCoordinate, common.state.textSelection);
  const blockPosition = useBlockPosition(nodes, common.state.cursorCoordinate, common.state.textSelection);

  return (
    <MenuList {...listProps}>
      <SectionMenu {...section} {...common} lineNodes={lineNodes} />
      <ItemizationMenu {...itemization} {...common} lineNodes={lineNodes} />
      <BoldMenu {...common} lineNodes={lineNodes} contentPosition={contentPosition} />
      <ItalicMenu {...common} lineNodes={lineNodes} contentPosition={contentPosition} />
      <UnderlineMenu {...common} lineNodes={lineNodes} contentPosition={contentPosition} />
      <BracketMenu {...bracket} {...common} lineNodes={lineNodes} contentPosition={contentPosition} />
      <HashtagMenu {...hashtag} {...common} lineNodes={lineNodes} contentPosition={contentPosition} />
      <TaggedLinkMenu tags={taggedLink} {...common} lineNodes={lineNodes} contentPosition={contentPosition} />
      <CodeMenu
        {...code}
        {...common}
        lineNodes={lineNodes}
        nodes={nodes}
        contentPosition={contentPosition}
        blockPosition={blockPosition}
      />
      <FormulaMenu
        {...formula}
        {...common}
        lineNodes={lineNodes}
        nodes={nodes}
        contentPosition={contentPosition}
        blockPosition={blockPosition}
      />
      <QuotationMenu {...quotation} {...common} lineNodes={lineNodes} />
    </MenuList>
  );
};
