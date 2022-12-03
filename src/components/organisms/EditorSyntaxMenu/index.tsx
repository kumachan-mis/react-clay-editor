import * as React from 'react';

import { useEditorPropsValueContext } from '../../../contexts/EditorPropsContext';
import { useTextNodesValueContext } from '../../../contexts/TextNodesContext';
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

import { useBlockPosition } from './hooks/blockPosition';
import { useBoldMenu } from './hooks/boldMenu';
import { useBracketMenu } from './hooks/bracketMenu';
import { useCodeMenu } from './hooks/codeMenu';
import { useCommonMenu } from './hooks/commonMenu';
import { useContentPosition } from './hooks/contentPosition';
import { useFormulaMenu } from './hooks/formulaMenu';
import { useHashtagMenu } from './hooks/hashtagMenu';
import { useItalicMenu } from './hooks/italicMenu';
import { useItemizationMenu } from './hooks/itemizationMenu';
import { useLineNodes } from './hooks/lineNodes';
import { useQuotationMenu } from './hooks/quotationMenu';
import { useSectionMenu } from './hooks/sectionMenu';
import { useTaggedLinkMenu } from './hooks/taggedLink';
import { useUnderlineMenu } from './hooks/underlineMenu';

export const EditorSyntaxMenu: React.FC = () => {
  const props = useEditorPropsValueContext();
  const nodes = useTextNodesValueContext();

  const common = useCommonMenu(props.syntax);
  const lineNodes = useLineNodes(nodes);
  const contentPosition = useContentPosition(lineNodes, common.state.cursorCoordinate, common.state.cursorSelection);
  const blockPosition = useBlockPosition(nodes, common.state.cursorCoordinate, common.state.cursorSelection);

  const sectionMenuProps = useSectionMenu(lineNodes, props.textProps, common);
  const itemizationMenuProps = useItemizationMenu(lineNodes, props.itemizationProps, common);
  const boldMenuProps = useBoldMenu(lineNodes, contentPosition, common);
  const italicMenuProps = useItalicMenu(lineNodes, contentPosition, common);
  const underlineMenuProps = useUnderlineMenu(lineNodes, contentPosition, common);
  const bracketMenuProps = useBracketMenu(lineNodes, contentPosition, props.bracketLinkProps, common);
  const hashtagMenuProps = useHashtagMenu(lineNodes, contentPosition, props.hashtagProps, common);
  const taggedLinkMenuProps = useTaggedLinkMenu(lineNodes, contentPosition, props.taggedLinkPropsMap, common);
  const codeMenuProps = useCodeMenu(lineNodes, nodes, contentPosition, blockPosition, props.codeProps, common);
  const formulaMenuProps = useFormulaMenu(lineNodes, nodes, contentPosition, blockPosition, props.formulaProps, common);
  const quotationMenuProps = useQuotationMenu(lineNodes, props.quotationProps, common);

  return (
    <MenuList>
      <SectionMenu {...sectionMenuProps} />
      <ItemizationMenu {...itemizationMenuProps} />
      <BoldMenu {...boldMenuProps} />
      <ItalicMenu {...italicMenuProps} />
      <UnderlineMenu {...underlineMenuProps} />
      <BracketMenu {...bracketMenuProps} />
      <HashtagMenu {...hashtagMenuProps} />
      <TaggedLinkMenu {...taggedLinkMenuProps} />
      <CodeMenu {...codeMenuProps} />
      <FormulaMenu {...formulaMenuProps} />
      <QuotationMenu {...quotationMenuProps} />
    </MenuList>
  );
};
