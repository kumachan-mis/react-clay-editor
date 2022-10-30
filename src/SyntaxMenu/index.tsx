import * as React from 'react';

import { createTestId } from '../common/utils';
import { DropdownMenu } from '../components/atoms/DropdownMenu';
import { useDropdownMenu } from '../components/atoms/DropdownMenu/hooks';
import { DropdownMenuButton } from '../components/atoms/DropdownMenuButton';
import { DropdownMenuList } from '../components/atoms/DropdownMenuList';
import { DropdownMenuListItem } from '../components/atoms/DropdownMenuListItem';
import { IconButtonMenu } from '../components/atoms/IconButtonMenu';
import { MenuList } from '../components/atoms/MenuList';
import { BoldIcon } from '../icons/BoldIcon';
import { BracketIcon } from '../icons/BracketIcon';
import { CodeIcon } from '../icons/CodeIcon';
import { FormulaIcon } from '../icons/FormulaIcon';
import { HashtagIcon } from '../icons/HashtagIcon';
import { ItalicIcon } from '../icons/ItalicIcon';
import { ItemizationIcon } from '../icons/Itemization';
import { QuotationIcon } from '../icons/Quotation';
import { SectionIcon } from '../icons/Section';
import { TaggedlinkIcon } from '../icons/TaggedlinkIcon';
import { UnderlineIcon } from '../icons/UnderlineIcon';

import {
  blockCodeMenuSwitch,
  handleOnBlockCodeItemClick,
  handleOnCodeButtonClick,
  handleOnInlineCodeItemClick,
  inlineCodeMenuSwitch,
} from './callbacks/code';
import { decorationMenuSwitch, handleOnDecorationClick } from './callbacks/decoration';
import {
  blockFormulaMenuSwitch,
  contentFormulaMenuSwitch,
  handleOnBlockFormulaItemClick,
  handleOnContentFormulaItemClick,
  handleOnFormulaButtonClick,
} from './callbacks/formula';
import {
  itemizationMenuSwitch,
  handleOnItemizationButtonClick,
  handleOnItemizationItemClick,
} from './callbacks/itemization';
import { linkMenuSwitch, getTagNameAtPosition, handleOnLinkItemClick } from './callbacks/link';
import { quotationMenuSwitch, handleOnQuotationButtonClick, handleOnQuotationItemClick } from './callbacks/quotation';
import { sectionMenuSwitch, handleOnSectionButtonClick, handleOnSectionItemClick } from './callbacks/section';
import { MenuHandler } from './callbacks/types';
import {
  SectionMenuConstants,
  ItemizationMenuConstants,
  BoldMenuConstants,
  ItalicMenuConstants,
  UnderlineMenuConstants,
  BracketMenuConstants,
  HashtagMenuConstants,
  TaggedLinkMenuConstants,
  CodeMenuConstants,
  FormulaMenuConstants,
  QuotationMenuConstants,
} from './constants';
import {
  SyntaxMenuProps,
  SectionMenuProps,
  ItemizationMenuProps,
  BracketMenuProps,
  HashtagMenuProps,
  TaggedLinkMenuProps,
  CodeMenuProps,
  FormulaMenuProps,
  QuotationMenuProps,
  ContentMenuProps,
  LineMenuProps,
  BlockMenuProps,
  CommonMenuProps,
} from './types';
import { useBlockPosition, useContentPosition, useLineNodes } from './utils';

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
      {common.syntax !== 'markdown' && (
        <UnderlineMenu {...common} lineNodes={lineNodes} contentPosition={contentPosition} />
      )}
      {!bracket?.disabled && (
        <BracketMenu {...bracket} {...common} lineNodes={lineNodes} contentPosition={contentPosition} />
      )}
      {!hashtag?.disabled && (
        <HashtagMenu {...hashtag} {...common} lineNodes={lineNodes} contentPosition={contentPosition} />
      )}
      {Object.keys(taggedLink || {}).length > 0 && (
        <TaggedLinkMenu tags={taggedLink} {...common} lineNodes={lineNodes} contentPosition={contentPosition} />
      )}
      {!code?.disabled && (
        <CodeMenu
          {...code}
          {...common}
          lineNodes={lineNodes}
          nodes={nodes}
          contentPosition={contentPosition}
          blockPosition={blockPosition}
        />
      )}
      {!formula?.disabled && (
        <FormulaMenu
          {...formula}
          {...common}
          lineNodes={lineNodes}
          nodes={nodes}
          contentPosition={contentPosition}
          blockPosition={blockPosition}
        />
      )}
      <QuotationMenu {...quotation} {...common} lineNodes={lineNodes} />
    </MenuList>
  );
};

const SectionMenu: React.FC<SectionMenuProps & LineMenuProps & CommonMenuProps> = ({
  syntax,
  text,
  lineNodes: nodes,
  state,
  setTextAndState,
  normalLabel = SectionMenuConstants.items.normal.defaultLabel,
  largerLabel = SectionMenuConstants.items.larger.defaultLabel,
  largestLabel = SectionMenuConstants.items.largest.defaultLabel,
}) => {
  const [open, anchorEl, onOpen, onClose] = useDropdownMenu();
  const menuSwitch = sectionMenuSwitch(syntax, nodes, state);
  const props: MenuHandler<SectionMenuProps> = { syntax, normalLabel, largerLabel, largestLabel };

  return (
    <DropdownMenu>
      <DropdownMenuButton
        open={open}
        onOpen={onOpen}
        onClose={onClose}
        pressed={menuSwitch !== 'off' && menuSwitch !== 'disabled'}
        disabled={menuSwitch === 'disabled'}
        buttonProps={{
          onClick: () => setTextAndState(...handleOnSectionButtonClick(text, nodes, state, props, menuSwitch)),
        }}
        data-testid={createTestId(SectionMenuConstants.testId)}
      >
        <SectionIcon />
      </DropdownMenuButton>
      <DropdownMenuList open={open} anchorEl={anchorEl}>
        <DropdownMenuListItem
          selected={menuSwitch === 'normal'}
          onClick={() => setTextAndState(...handleOnSectionItemClick(text, nodes, state, props, 'normal', menuSwitch))}
          data-testid={createTestId(SectionMenuConstants.items.normal.testId)}
        >
          {normalLabel}
        </DropdownMenuListItem>
        <DropdownMenuListItem
          selected={menuSwitch === 'larger'}
          onClick={() => setTextAndState(...handleOnSectionItemClick(text, nodes, state, props, 'larger', menuSwitch))}
          data-testid={createTestId(SectionMenuConstants.items.larger.testId)}
        >
          {largerLabel}
        </DropdownMenuListItem>
        <DropdownMenuListItem
          selected={menuSwitch === 'largest'}
          onClick={() => setTextAndState(...handleOnSectionItemClick(text, nodes, state, props, 'largest', menuSwitch))}
          data-testid={createTestId(SectionMenuConstants.items.largest.testId)}
        >
          {largestLabel}
        </DropdownMenuListItem>
      </DropdownMenuList>
    </DropdownMenu>
  );
};

const ItemizationMenu: React.FC<ItemizationMenuProps & LineMenuProps & CommonMenuProps> = ({
  syntax,
  text,
  lineNodes: nodes,
  state,
  setTextAndState,
  indentLabel = ItemizationMenuConstants.items.indent.defaultLabel,
  outdentLabel = ItemizationMenuConstants.items.outdent.defaultLabel,
}) => {
  const [open, anchorEl, onOpen, onClose] = useDropdownMenu();
  const menuSwitch = itemizationMenuSwitch(syntax, nodes, state);
  const props: MenuHandler<ItemizationMenuProps> = { syntax, indentLabel, outdentLabel };

  return (
    <DropdownMenu>
      <DropdownMenuButton
        open={open}
        onOpen={onOpen}
        onClose={onClose}
        pressed={menuSwitch === 'allon'}
        disabled={menuSwitch === 'disabled'}
        buttonProps={{
          onClick: () => setTextAndState(...handleOnItemizationButtonClick(text, nodes, state, props, menuSwitch)),
        }}
        data-testid={createTestId(ItemizationMenuConstants.testId)}
      >
        <ItemizationIcon />
      </DropdownMenuButton>
      <DropdownMenuList open={open} anchorEl={anchorEl}>
        <DropdownMenuListItem
          onClick={() =>
            setTextAndState(...handleOnItemizationItemClick(text, nodes, state, props, 'indent', menuSwitch))
          }
          data-testid={createTestId(ItemizationMenuConstants.items.indent.testId)}
        >
          {indentLabel}
        </DropdownMenuListItem>
        <DropdownMenuListItem
          disabled={menuSwitch === 'alloff'}
          onClick={() =>
            setTextAndState(...handleOnItemizationItemClick(text, nodes, state, props, 'outdent', menuSwitch))
          }
          data-testid={createTestId(ItemizationMenuConstants.items.outdent.testId)}
        >
          {outdentLabel}
        </DropdownMenuListItem>
      </DropdownMenuList>
    </DropdownMenu>
  );
};

const BoldMenu: React.FC<ContentMenuProps & CommonMenuProps> = ({
  syntax,
  text,
  lineNodes: nodes,
  contentPosition,
  state,
  setTextAndState,
}) => {
  const props: MenuHandler = { syntax };
  const menuSwitch = decorationMenuSwitch(syntax, nodes, contentPosition);

  return (
    <IconButtonMenu
      pressed={menuSwitch.bold === 'on'}
      disabled={menuSwitch.bold === 'disabled'}
      onClick={() =>
        setTextAndState(...handleOnDecorationClick(text, nodes, contentPosition, state, props, 'bold', menuSwitch))
      }
      data-testid={createTestId(BoldMenuConstants.testId)}
    >
      <BoldIcon />
    </IconButtonMenu>
  );
};

const ItalicMenu: React.FC<ContentMenuProps & CommonMenuProps> = ({
  syntax,
  text,
  lineNodes: nodes,
  contentPosition,
  state,
  setTextAndState,
}) => {
  const props: MenuHandler = { syntax };
  const menuSwitch = decorationMenuSwitch(syntax, nodes, contentPosition);

  return (
    <IconButtonMenu
      pressed={menuSwitch.italic === 'on'}
      disabled={menuSwitch.italic === 'disabled'}
      onClick={() =>
        setTextAndState(...handleOnDecorationClick(text, nodes, contentPosition, state, props, 'italic', menuSwitch))
      }
      data-testid={createTestId(ItalicMenuConstants.testId)}
    >
      <ItalicIcon />
    </IconButtonMenu>
  );
};

const UnderlineMenu: React.FC<ContentMenuProps & CommonMenuProps> = ({
  syntax,
  text,
  lineNodes: nodes,
  contentPosition,
  state,
  setTextAndState,
}) => {
  const props: MenuHandler = { syntax };
  const menuSwitch = decorationMenuSwitch(syntax, nodes, contentPosition);

  return (
    <IconButtonMenu
      pressed={menuSwitch.underline === 'on'}
      disabled={menuSwitch.underline === 'disabled'}
      onClick={() =>
        setTextAndState(...handleOnDecorationClick(text, nodes, contentPosition, state, props, 'underline', menuSwitch))
      }
      data-testid={createTestId(UnderlineMenuConstants.testId)}
    >
      <UnderlineIcon />
    </IconButtonMenu>
  );
};

const BracketMenu: React.FC<BracketMenuProps & CommonMenuProps & ContentMenuProps> = ({
  syntax,
  text,
  lineNodes: nodes,
  contentPosition,
  state,
  setTextAndState,
  disabled,
  suggestions = [],
  initialSuggestionIndex = 0,
  label = BracketMenuConstants.defaultLabel,
}) => {
  const props: MenuHandler<BracketMenuProps> = { syntax, label, suggestions, initialSuggestionIndex };
  const menuItem = { type: 'bracketLink' } as const;
  const menuSwitch = linkMenuSwitch(nodes, contentPosition, 'bracketLink');

  return (
    <IconButtonMenu
      pressed={menuSwitch === 'on'}
      disabled={disabled || menuSwitch === 'disabled'}
      onClick={() =>
        setTextAndState(...handleOnLinkItemClick(text, nodes, contentPosition, state, props, menuItem, menuSwitch))
      }
      data-testid={createTestId(BracketMenuConstants.testId)}
    >
      <BracketIcon />
    </IconButtonMenu>
  );
};

const HashtagMenu: React.FC<HashtagMenuProps & ContentMenuProps & CommonMenuProps> = ({
  syntax,
  text,
  lineNodes: nodes,
  contentPosition,
  state,
  setTextAndState,
  disabled,
  suggestions = [],
  initialSuggestionIndex = 0,
  label = HashtagMenuConstants.defaultLabel,
}) => {
  const props: MenuHandler<HashtagMenuProps> = { syntax, label, suggestions, initialSuggestionIndex };
  const menuItem = { type: 'hashtag' } as const;
  const menuSwitch = linkMenuSwitch(nodes, contentPosition, 'hashtag');

  return (
    <IconButtonMenu
      pressed={menuSwitch === 'on'}
      disabled={disabled || menuSwitch === 'disabled'}
      onClick={() =>
        setTextAndState(...handleOnLinkItemClick(text, nodes, contentPosition, state, props, menuItem, menuSwitch))
      }
      data-testid={createTestId(HashtagMenuConstants.testId)}
    >
      <HashtagIcon />
    </IconButtonMenu>
  );
};

const TaggedLinkMenu: React.FC<
  { tags?: { [tagName: string]: TaggedLinkMenuProps } } & ContentMenuProps & CommonMenuProps
> = ({ tags, syntax, text, lineNodes: nodes, contentPosition, state, setTextAndState }) => {
  const [open, anchorEl, onOpen, onClose] = useDropdownMenu();
  const tagEntries = Object.entries(tags || {});
  const menuSwitch = linkMenuSwitch(nodes, contentPosition, 'taggedLink');
  const tagNameOrUndefined = getTagNameAtPosition(nodes, contentPosition);

  const defaultLinkProps = {
    label: TaggedLinkMenuConstants.items.defaultLabel,
    suggestions: [],
    initialSuggestionIndex: 0,
  };
  let handleOnButtonClick = undefined;
  if (tags && tagEntries.length > 0) {
    const [tagName, linkProps] = tagNameOrUndefined ? [tagNameOrUndefined, tags[tagNameOrUndefined]] : tagEntries[0];
    const props: MenuHandler<TaggedLinkMenuProps> = { syntax, ...defaultLinkProps, ...linkProps };
    const menuItem = { type: 'taggedLink', tag: tagName } as const;
    handleOnButtonClick = () =>
      setTextAndState(...handleOnLinkItemClick(text, nodes, contentPosition, state, props, menuItem, menuSwitch));
  }

  return (
    <DropdownMenu>
      <DropdownMenuButton
        open={open}
        onOpen={onOpen}
        onClose={onClose}
        pressed={menuSwitch === 'on'}
        disabled={tagEntries.length === 0 || menuSwitch === 'disabled'}
        buttonProps={{ onClick: handleOnButtonClick }}
        data-testid={createTestId(TaggedLinkMenuConstants.testId)}
      >
        <TaggedlinkIcon />
      </DropdownMenuButton>
      <DropdownMenuList open={open} anchorEl={anchorEl}>
        {tagEntries.map(
          ([
            tagName,
            { label = TaggedLinkMenuConstants.items.defaultLabel, suggestions = [], initialSuggestionIndex = 0 },
          ]) => {
            const props: MenuHandler<TaggedLinkMenuProps> = { syntax, label, suggestions, initialSuggestionIndex };
            const menuItem = { type: 'taggedLink', tag: tagName } as const;
            return (
              <DropdownMenuListItem
                key={tagName}
                selected={tagNameOrUndefined === tagName}
                onClick={() =>
                  setTextAndState(
                    ...handleOnLinkItemClick(text, nodes, contentPosition, state, props, menuItem, menuSwitch)
                  )
                }
                data-testid={createTestId(TaggedLinkMenuConstants.items.testId(tagName))}
              >
                {TaggedLinkMenuConstants.items.taggedLabel(tagName, label)}
              </DropdownMenuListItem>
            );
          }
        )}
      </DropdownMenuList>
    </DropdownMenu>
  );
};

const CodeMenu: React.FC<CodeMenuProps & ContentMenuProps & BlockMenuProps & CommonMenuProps> = ({
  syntax,
  text,
  lineNodes,
  nodes,
  contentPosition,
  blockPosition,
  state,
  setTextAndState,
  disabled,
  inlineLabel = CodeMenuConstants.items.inline.defaultLabel,
  blockLabel = CodeMenuConstants.items.block.defaultLabel,
}) => {
  const [open, anchorEl, onOpen, onClose] = useDropdownMenu();
  const props: MenuHandler<CodeMenuProps> = { syntax, inlineLabel, blockLabel };
  const inlineMenuSwitch = inlineCodeMenuSwitch(lineNodes, contentPosition);
  const blockMenuSwitch = blockCodeMenuSwitch(nodes, blockPosition, state);

  return (
    <DropdownMenu>
      <DropdownMenuButton
        open={open}
        onOpen={onOpen}
        onClose={onClose}
        pressed={inlineMenuSwitch === 'on' || blockMenuSwitch === 'on'}
        disabled={disabled || (inlineMenuSwitch === 'disabled' && blockMenuSwitch === 'disabled')}
        buttonProps={{
          onClick: () =>
            setTextAndState(
              ...handleOnCodeButtonClick(
                text,
                lineNodes,
                nodes,
                contentPosition,
                blockPosition,
                state,
                props,
                inlineMenuSwitch,
                blockMenuSwitch
              )
            ),
        }}
        data-testid={createTestId(CodeMenuConstants.testId)}
      >
        <CodeIcon />
      </DropdownMenuButton>
      <DropdownMenuList open={open} anchorEl={anchorEl}>
        <DropdownMenuListItem
          selected={inlineMenuSwitch === 'on'}
          disabled={inlineMenuSwitch === 'disabled'}
          onClick={() =>
            setTextAndState(...handleOnInlineCodeItemClick(text, lineNodes, contentPosition, state, inlineMenuSwitch))
          }
          data-testid={createTestId(CodeMenuConstants.items.inline.testId)}
        >
          {inlineLabel}
        </DropdownMenuListItem>
        <DropdownMenuListItem
          selected={blockMenuSwitch === 'on'}
          disabled={blockMenuSwitch === 'disabled'}
          onClick={() =>
            setTextAndState(...handleOnBlockCodeItemClick(text, nodes, blockPosition, state, props, blockMenuSwitch))
          }
          data-testid={createTestId(CodeMenuConstants.items.block.testId)}
        >
          {blockLabel}
        </DropdownMenuListItem>
      </DropdownMenuList>
    </DropdownMenu>
  );
};

const FormulaMenu: React.FC<FormulaMenuProps & ContentMenuProps & BlockMenuProps & CommonMenuProps> = ({
  syntax,
  text,
  lineNodes,
  nodes,
  contentPosition,
  blockPosition,
  state,
  setTextAndState,
  disabled,
  inlineLabel = FormulaMenuConstants.items.inline.defaultLabel,
  displayLabel = FormulaMenuConstants.items.display.defaultLabel,
  blockLabel = FormulaMenuConstants.items.block.defaultLabel,
}) => {
  const [open, anchorEl, onOpen, onClose] = useDropdownMenu();
  const props: MenuHandler<FormulaMenuProps> = { syntax, inlineLabel, displayLabel, blockLabel };
  const contentMenuSwitch = contentFormulaMenuSwitch(lineNodes, contentPosition);
  const blockMenuSwitch = blockFormulaMenuSwitch(nodes, blockPosition, state);

  return (
    <DropdownMenu>
      <DropdownMenuButton
        open={open}
        onOpen={onOpen}
        onClose={onClose}
        pressed={contentMenuSwitch === 'inline' || contentMenuSwitch === 'display' || blockMenuSwitch === 'on'}
        disabled={disabled || (contentMenuSwitch === 'disabled' && blockMenuSwitch === 'disabled')}
        buttonProps={{
          onClick: () =>
            setTextAndState(
              ...handleOnFormulaButtonClick(
                text,
                lineNodes,
                nodes,
                contentPosition,
                blockPosition,
                state,
                props,
                contentMenuSwitch,
                blockMenuSwitch
              )
            ),
        }}
        data-testid={createTestId(FormulaMenuConstants.testId)}
      >
        <FormulaIcon />
      </DropdownMenuButton>
      <DropdownMenuList open={open} anchorEl={anchorEl}>
        <DropdownMenuListItem
          selected={contentMenuSwitch === 'inline'}
          disabled={contentMenuSwitch === 'disabled'}
          onClick={() =>
            setTextAndState(
              ...handleOnContentFormulaItemClick(text, lineNodes, contentPosition, state, 'inline', contentMenuSwitch)
            )
          }
          data-testid={createTestId(FormulaMenuConstants.items.inline.testId)}
        >
          {inlineLabel}
        </DropdownMenuListItem>
        <DropdownMenuListItem
          selected={contentMenuSwitch === 'display'}
          disabled={contentMenuSwitch === 'disabled'}
          onClick={() =>
            setTextAndState(
              ...handleOnContentFormulaItemClick(text, lineNodes, contentPosition, state, 'display', contentMenuSwitch)
            )
          }
          data-testid={createTestId(FormulaMenuConstants.items.display.testId)}
        >
          {displayLabel}
        </DropdownMenuListItem>
        <DropdownMenuListItem
          selected={blockMenuSwitch === 'on'}
          disabled={blockMenuSwitch === 'disabled'}
          onClick={() =>
            setTextAndState(...handleOnBlockFormulaItemClick(text, nodes, blockPosition, state, props, blockMenuSwitch))
          }
          data-testid={createTestId(FormulaMenuConstants.items.block.testId)}
        >
          {blockLabel}
        </DropdownMenuListItem>
      </DropdownMenuList>
    </DropdownMenu>
  );
};

const QuotationMenu: React.FC<QuotationMenuProps & LineMenuProps & CommonMenuProps> = ({
  syntax,
  text,
  lineNodes: nodes,
  state,
  setTextAndState,
  indentLabel = QuotationMenuConstants.items.indent.defaultLabel,
  outdentLabel = QuotationMenuConstants.items.outdent.defaultLabel,
}) => {
  const [open, anchorEl, onOpen, onClose] = useDropdownMenu();
  const menuSwitch = quotationMenuSwitch(syntax, nodes, state);
  const props: MenuHandler<QuotationMenuProps> = { syntax, indentLabel, outdentLabel };

  return (
    <DropdownMenu>
      <DropdownMenuButton
        open={open}
        onOpen={onOpen}
        onClose={onClose}
        pressed={menuSwitch === 'allon'}
        disabled={menuSwitch === 'disabled'}
        buttonProps={{
          onClick: () => setTextAndState(...handleOnQuotationButtonClick(text, nodes, state, props, menuSwitch)),
        }}
        data-testid={createTestId(QuotationMenuConstants.testId)}
      >
        <QuotationIcon />
      </DropdownMenuButton>
      <DropdownMenuList open={open} anchorEl={anchorEl}>
        <DropdownMenuListItem
          onClick={() =>
            setTextAndState(...handleOnQuotationItemClick(text, nodes, state, props, 'indent', menuSwitch))
          }
          data-testid={createTestId(QuotationMenuConstants.items.indent.testId)}
        >
          {indentLabel}
        </DropdownMenuListItem>
        <DropdownMenuListItem
          disabled={menuSwitch === 'alloff'}
          onClick={() =>
            setTextAndState(...handleOnQuotationItemClick(text, nodes, state, props, 'outdent', menuSwitch))
          }
          data-testid={createTestId(QuotationMenuConstants.items.outdent.testId)}
        >
          {outdentLabel}
        </DropdownMenuListItem>
      </DropdownMenuList>
    </DropdownMenu>
  );
};
