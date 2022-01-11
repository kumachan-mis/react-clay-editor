import * as React from 'react';

import { createTestId } from '../common/utils';

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
  MenuContainer,
  IconButtonMenu,
  DropdownMenu,
  DropdownMenuAnchor,
  DropdownMenuList,
  DropdownMenuItem,
} from './components';
import { useDropdownMenu } from './components/hooks';
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
  SectionIcon,
  ItemizationIcon,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  BracketIcon,
  HashtagIcon,
  TaggedLinkIcon,
  CodeIcon,
  FormulaIcon,
  QuotationIcon,
} from './icons';
import {
  SyntaxMenuProps,
  SectionMenuProps,
  ItemizationMenuProps,
  BoldMenuProps,
  ItalicMenuProps,
  UnderlineMenuProps,
  BracketMenuProps,
  HashtagMenuProps,
  TaggedLinkMenuPropsMap,
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
  containerProps,
  ...common
}) => {
  const lineNodes = useLineNodes(nodes);
  const contentPosition = useContentPosition(lineNodes, common.state.cursorCoordinate, common.state.textSelection);
  const blockPosition = useBlockPosition(nodes, common.state.cursorCoordinate, common.state.textSelection);

  return (
    <MenuContainer {...containerProps}>
      <SectionMenu {...section} {...common} lineNodes={lineNodes} />
      <ItemizationMenu {...itemization} {...common} lineNodes={lineNodes} />
      <BoldMenu {...common} lineNodes={lineNodes} contentPosition={contentPosition} />
      <ItalicMenu {...common} lineNodes={lineNodes} contentPosition={contentPosition} />
      <UnderlineMenu {...common} lineNodes={lineNodes} contentPosition={contentPosition} />
      <BracketMenu {...bracket} {...common} lineNodes={lineNodes} contentPosition={contentPosition} />
      <HashtagMenu {...hashtag} {...common} lineNodes={lineNodes} contentPosition={contentPosition} />
      <TaggedLinkMenu {...taggedLink} {...common} lineNodes={lineNodes} contentPosition={contentPosition} />
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
    </MenuContainer>
  );
};

const SectionMenu: React.FC<SectionMenuProps & LineMenuProps & CommonMenuProps> = ({
  syntax,
  text,
  lineNodes: nodes,
  state,
  setTextAndState,
  disabled,
  normalLabel = SectionMenuConstants.items.normal.defaultLabel,
  largerLabel = SectionMenuConstants.items.larger.defaultLabel,
  largestLabel = SectionMenuConstants.items.largest.defaultLabel,
}) => {
  const [open, anchorEl, onOpen, onClose] = useDropdownMenu();
  const menuSwitch = sectionMenuSwitch(syntax, nodes, state);
  const props: MenuHandler<SectionMenuProps> = { syntax, normalLabel, largerLabel, largestLabel };

  return (
    <DropdownMenu>
      <DropdownMenuAnchor
        open={open}
        onOpen={onOpen}
        onClose={onClose}
        active={menuSwitch !== 'off' && menuSwitch !== 'disabled'}
        disabled={disabled || menuSwitch === 'disabled'}
        buttonProps={{
          onClick: () => setTextAndState(...handleOnSectionButtonClick(text, nodes, state, props, menuSwitch)),
        }}
        data-testid={createTestId(SectionMenuConstants.testId)}
      >
        <SectionIcon />
      </DropdownMenuAnchor>
      <DropdownMenuList open={open} anchorEl={anchorEl}>
        <DropdownMenuItem
          active={menuSwitch === 'normal'}
          onClick={() => setTextAndState(...handleOnSectionItemClick(text, nodes, state, props, 'normal', menuSwitch))}
          data-testid={createTestId(SectionMenuConstants.items.normal.testId)}
        >
          {normalLabel}
        </DropdownMenuItem>
        <DropdownMenuItem
          active={menuSwitch === 'larger'}
          onClick={() => setTextAndState(...handleOnSectionItemClick(text, nodes, state, props, 'larger', menuSwitch))}
          data-testid={createTestId(SectionMenuConstants.items.larger.testId)}
        >
          {largerLabel}
        </DropdownMenuItem>
        <DropdownMenuItem
          active={menuSwitch === 'largest'}
          onClick={() => setTextAndState(...handleOnSectionItemClick(text, nodes, state, props, 'largest', menuSwitch))}
          data-testid={createTestId(SectionMenuConstants.items.largest.testId)}
        >
          {largestLabel}
        </DropdownMenuItem>
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
  disabled,
  indentLabel = ItemizationMenuConstants.items.indent.defaultLabel,
  outdentLabel = ItemizationMenuConstants.items.outdent.defaultLabel,
}) => {
  const [open, anchorEl, onOpen, onClose] = useDropdownMenu();
  const menuSwitch = itemizationMenuSwitch(syntax, nodes, state);
  const props: MenuHandler<ItemizationMenuProps> = { syntax, indentLabel, outdentLabel };

  return (
    <DropdownMenu>
      <DropdownMenuAnchor
        open={open}
        onOpen={onOpen}
        onClose={onClose}
        active={menuSwitch === 'allon'}
        disabled={disabled || menuSwitch === 'disabled'}
        buttonProps={{
          onClick: () => setTextAndState(...handleOnItemizationButtonClick(text, nodes, state, props, menuSwitch)),
        }}
        data-testid={createTestId(ItemizationMenuConstants.testId)}
      >
        <ItemizationIcon />
      </DropdownMenuAnchor>
      <DropdownMenuList open={open} anchorEl={anchorEl}>
        <DropdownMenuItem
          onClick={() =>
            setTextAndState(...handleOnItemizationItemClick(text, nodes, state, props, 'indent', menuSwitch))
          }
          data-testid={createTestId(ItemizationMenuConstants.items.indent.testId)}
        >
          {indentLabel}
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={menuSwitch === 'alloff'}
          onClick={() =>
            setTextAndState(...handleOnItemizationItemClick(text, nodes, state, props, 'outdent', menuSwitch))
          }
          data-testid={createTestId(ItemizationMenuConstants.items.outdent.testId)}
        >
          {outdentLabel}
        </DropdownMenuItem>
      </DropdownMenuList>
    </DropdownMenu>
  );
};

const BoldMenu: React.FC<BoldMenuProps & ContentMenuProps & CommonMenuProps> = ({
  syntax,
  text,
  lineNodes: nodes,
  contentPosition,
  state,
  setTextAndState,
  disabled,
}) => {
  const props: MenuHandler<BoldMenuProps> = { syntax };
  const menuSwitch = decorationMenuSwitch(syntax, nodes, contentPosition);

  return (
    <IconButtonMenu
      active={menuSwitch.bold === 'on'}
      disabled={disabled || menuSwitch.bold === 'disabled'}
      onClick={() =>
        setTextAndState(...handleOnDecorationClick(text, nodes, contentPosition, state, props, 'bold', menuSwitch))
      }
      data-testid={createTestId(BoldMenuConstants.testId)}
    >
      <BoldIcon />
    </IconButtonMenu>
  );
};

const ItalicMenu: React.FC<ItalicMenuProps & ContentMenuProps & CommonMenuProps> = ({
  syntax,
  text,
  lineNodes: nodes,
  contentPosition,
  state,
  setTextAndState,
  disabled,
}) => {
  const props: MenuHandler<ItalicMenuProps> = { syntax };
  const menuSwitch = decorationMenuSwitch(syntax, nodes, contentPosition);

  return (
    <IconButtonMenu
      active={menuSwitch.italic === 'on'}
      disabled={disabled || menuSwitch.italic === 'disabled'}
      onClick={() =>
        setTextAndState(...handleOnDecorationClick(text, nodes, contentPosition, state, props, 'italic', menuSwitch))
      }
      data-testid={createTestId(ItalicMenuConstants.testId)}
    >
      <ItalicIcon />
    </IconButtonMenu>
  );
};

const UnderlineMenu: React.FC<UnderlineMenuProps & ContentMenuProps & CommonMenuProps> = ({
  syntax,
  text,
  lineNodes: nodes,
  contentPosition,
  state,
  setTextAndState,
  disabled,
}) => {
  const props: MenuHandler<UnderlineMenuProps> = { syntax };
  const menuSwitch = decorationMenuSwitch(syntax, nodes, contentPosition);

  return (
    <IconButtonMenu
      active={menuSwitch.underline === 'on'}
      disabled={disabled || menuSwitch.underline === 'disabled'}
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
}) => {
  const props: MenuHandler<BracketMenuProps> = { syntax, suggestions, initialSuggestionIndex };
  const menuItem = { type: 'bracketLink' } as const;
  const menuSwitch = linkMenuSwitch(nodes, contentPosition, 'bracketLink');

  return (
    <IconButtonMenu
      active={menuSwitch === 'on'}
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
}) => {
  const props: MenuHandler<HashtagMenuProps> = { syntax, suggestions, initialSuggestionIndex };
  const menuItem = { type: 'hashtag' } as const;
  const menuSwitch = linkMenuSwitch(nodes, contentPosition, 'hashtag');

  return (
    <IconButtonMenu
      active={menuSwitch === 'on'}
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

const TaggedLinkMenu: React.FC<TaggedLinkMenuPropsMap & ContentMenuProps & CommonMenuProps> = ({
  tags,
  syntax,
  text,
  lineNodes: nodes,
  contentPosition,
  state,
  setTextAndState,
  disabled,
}) => {
  const [open, anchorEl, onOpen, onClose] = useDropdownMenu();
  const tagEntries = Object.entries(tags || {});
  const menuSwitch = linkMenuSwitch(nodes, contentPosition, 'taggedLink');
  const tagNameOrUndefined = getTagNameAtPosition(nodes, contentPosition);
  const { defaultLabel } = TaggedLinkMenuConstants.items;

  let handleOnButtonClick = undefined;
  if (tags && tagEntries.length > 0) {
    const [tagName, linkProps] = tagNameOrUndefined ? [tagNameOrUndefined, tags[tagNameOrUndefined]] : tagEntries[0];
    const defaultLinkProps = { label: defaultLabel(tagName), suggestions: [], initialSuggestionIndex: 0 };
    const props: MenuHandler<TaggedLinkMenuProps> = { syntax, ...defaultLinkProps, ...linkProps };
    const menuItem = { type: 'taggedLink', tag: tagName } as const;
    handleOnButtonClick = () =>
      setTextAndState(...handleOnLinkItemClick(text, nodes, contentPosition, state, props, menuItem, menuSwitch));
  }

  return (
    <DropdownMenu>
      <DropdownMenuAnchor
        open={open}
        onOpen={onOpen}
        onClose={onClose}
        active={menuSwitch === 'on'}
        disabled={disabled || !tags || tagEntries.length === 0 || menuSwitch === 'disabled'}
        buttonProps={{ onClick: handleOnButtonClick }}
        data-testid={createTestId(TaggedLinkMenuConstants.testId)}
      >
        <TaggedLinkIcon />
      </DropdownMenuAnchor>
      <DropdownMenuList open={open} anchorEl={anchorEl}>
        {tagEntries.map(
          ([tagName, { label = defaultLabel(tagName), suggestions = [], initialSuggestionIndex = 0 }]) => {
            const props: MenuHandler<TaggedLinkMenuProps> = { syntax, label, suggestions, initialSuggestionIndex };
            const menuItem = { type: 'taggedLink', tag: tagName } as const;
            return (
              <DropdownMenuItem
                key={tagName}
                active={tagNameOrUndefined === tagName}
                onClick={() =>
                  setTextAndState(
                    ...handleOnLinkItemClick(text, nodes, contentPosition, state, props, menuItem, menuSwitch)
                  )
                }
                data-testid={createTestId(TaggedLinkMenuConstants.items.testId(tagName))}
              >
                {label}
              </DropdownMenuItem>
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
  const blockMenuSwitch = blockCodeMenuSwitch(lineNodes, nodes, blockPosition, state);

  return (
    <DropdownMenu>
      <DropdownMenuAnchor
        open={open}
        onOpen={onOpen}
        onClose={onClose}
        active={inlineMenuSwitch === 'on' || blockMenuSwitch === 'on'}
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
      </DropdownMenuAnchor>
      <DropdownMenuList open={open} anchorEl={anchorEl}>
        <DropdownMenuItem
          active={inlineMenuSwitch === 'on'}
          disabled={inlineMenuSwitch === 'disabled'}
          onClick={() =>
            setTextAndState(...handleOnInlineCodeItemClick(text, lineNodes, contentPosition, state, inlineMenuSwitch))
          }
          data-testid={createTestId(CodeMenuConstants.items.inline.testId)}
        >
          {inlineLabel}
        </DropdownMenuItem>
        <DropdownMenuItem
          active={blockMenuSwitch === 'on'}
          disabled={blockMenuSwitch === 'disabled'}
          onClick={() =>
            setTextAndState(...handleOnBlockCodeItemClick(text, nodes, blockPosition, state, props, blockMenuSwitch))
          }
          data-testid={createTestId(CodeMenuConstants.items.block.testId)}
        >
          {blockLabel}
        </DropdownMenuItem>
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
  const blockMenuSwitch = blockFormulaMenuSwitch(lineNodes, nodes, blockPosition, state);

  return (
    <DropdownMenu>
      <DropdownMenuAnchor
        open={open}
        onOpen={onOpen}
        onClose={onClose}
        active={contentMenuSwitch === 'inline' || contentMenuSwitch === 'display' || blockMenuSwitch === 'on'}
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
      </DropdownMenuAnchor>
      <DropdownMenuList open={open} anchorEl={anchorEl}>
        <DropdownMenuItem
          active={contentMenuSwitch === 'inline'}
          disabled={contentMenuSwitch === 'disabled'}
          onClick={() =>
            setTextAndState(
              ...handleOnContentFormulaItemClick(text, lineNodes, contentPosition, state, 'inline', contentMenuSwitch)
            )
          }
          data-testid={createTestId(FormulaMenuConstants.items.inline.testId)}
        >
          {inlineLabel}
        </DropdownMenuItem>
        <DropdownMenuItem
          active={contentMenuSwitch === 'display'}
          disabled={contentMenuSwitch === 'disabled'}
          onClick={() =>
            setTextAndState(
              ...handleOnContentFormulaItemClick(text, lineNodes, contentPosition, state, 'display', contentMenuSwitch)
            )
          }
          data-testid={createTestId(FormulaMenuConstants.items.display.testId)}
        >
          {displayLabel}
        </DropdownMenuItem>
        <DropdownMenuItem
          active={blockMenuSwitch === 'on'}
          disabled={blockMenuSwitch === 'disabled'}
          onClick={() =>
            setTextAndState(...handleOnBlockFormulaItemClick(text, nodes, blockPosition, state, props, blockMenuSwitch))
          }
          data-testid={createTestId(FormulaMenuConstants.items.block.testId)}
        >
          {blockLabel}
        </DropdownMenuItem>
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
  disabled,
  indentLabel = QuotationMenuConstants.items.indent.defaultLabel,
  outdentLabel = QuotationMenuConstants.items.outdent.defaultLabel,
}) => {
  const [open, anchorEl, onOpen, onClose] = useDropdownMenu();
  const menuSwitch = quotationMenuSwitch(syntax, nodes, state);
  const props: MenuHandler<QuotationMenuProps> = { syntax, indentLabel, outdentLabel };

  return (
    <DropdownMenu>
      <DropdownMenuAnchor
        open={open}
        onOpen={onOpen}
        onClose={onClose}
        active={menuSwitch === 'allon'}
        disabled={disabled || menuSwitch === 'disabled'}
        buttonProps={{
          onClick: () => setTextAndState(...handleOnQuotationButtonClick(text, nodes, state, props, menuSwitch)),
        }}
        data-testid={createTestId(QuotationMenuConstants.testId)}
      >
        <QuotationIcon />
      </DropdownMenuAnchor>
      <DropdownMenuList open={open} anchorEl={anchorEl}>
        <DropdownMenuItem
          onClick={() =>
            setTextAndState(...handleOnQuotationItemClick(text, nodes, state, props, 'indent', menuSwitch))
          }
          data-testid={createTestId(QuotationMenuConstants.items.indent.testId)}
        >
          {indentLabel}
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={menuSwitch === 'alloff'}
          onClick={() =>
            setTextAndState(...handleOnQuotationItemClick(text, nodes, state, props, 'outdent', menuSwitch))
          }
          data-testid={createTestId(QuotationMenuConstants.items.outdent.testId)}
        >
          {outdentLabel}
        </DropdownMenuItem>
      </DropdownMenuList>
    </DropdownMenu>
  );
};
