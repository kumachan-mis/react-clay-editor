import * as React from 'react';

import { createTestId } from '../common/utils';

import { handleOnSectionButtonClick, handleOnSectionItemClick, sectionMenuSwitch } from './callbacks/section';
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
  CodeMenuProps,
  FormulaMenuProps,
  QuotationMenuProps,
  MenuCommonProps,
} from './types';

export const SyntaxMenu: React.FC<SyntaxMenuProps> = ({
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
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  return (
    <MenuContainer {...containerProps} ref={containerRef}>
      <SectionMenu element={containerRef.current} {...section} {...common} />
      <ItemizationMenu element={containerRef.current} {...itemization} {...common} />
      <BoldMenu element={containerRef.current} {...common} />
      <ItalicMenu element={containerRef.current} {...common} />
      <UnderlineMenu element={containerRef.current} {...common} />
      <BracketMenu element={containerRef.current} {...bracket} {...common} />
      <HashtagMenu element={containerRef.current} {...hashtag} {...common} />
      <TaggedLinkMenu element={containerRef.current} {...taggedLink} {...common} />
      <CodeMenu element={containerRef.current} {...code} {...common} />
      <FormulaMenu element={containerRef.current} {...formula} {...common} />
      <QuotationMenu element={containerRef.current} {...quotation} {...common} />
    </MenuContainer>
  );
};

const SectionMenu: React.FC<SectionMenuProps & MenuCommonProps> = ({
  syntax,
  text,
  nodes,
  state,
  setTextAndState,
  element,
  disabled,
  normalLabel = SectionMenuConstants.items.normal.defaultLabel,
  largerLabel = SectionMenuConstants.items.larger.defaultLabel,
  largestLabel = SectionMenuConstants.items.largest.defaultLabel,
}) => {
  const [open, anchorEl, onOpen, onClose] = useDropdownMenu();
  const menuSwitch = sectionMenuSwitch(syntax, nodes, state, element);
  const props: MenuHandler<SectionMenuProps> = { syntax, normalLabel, largerLabel, largestLabel };

  return (
    <DropdownMenu>
      <DropdownMenuAnchor
        open={open}
        onOpen={onOpen}
        onClose={onClose}
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
          onClick={() => setTextAndState(...handleOnSectionItemClick(text, nodes, state, props, 'normal', menuSwitch))}
          data-testid={createTestId(SectionMenuConstants.items.normal.testId)}
        >
          {normalLabel}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTextAndState(...handleOnSectionItemClick(text, nodes, state, props, 'larger', menuSwitch))}
          data-testid={createTestId(SectionMenuConstants.items.larger.testId)}
        >
          {largerLabel}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTextAndState(...handleOnSectionItemClick(text, nodes, state, props, 'largest', menuSwitch))}
          data-testid={createTestId(SectionMenuConstants.items.largest.testId)}
        >
          {largestLabel}
        </DropdownMenuItem>
      </DropdownMenuList>
    </DropdownMenu>
  );
};

const ItemizationMenu: React.FC<ItemizationMenuProps & MenuCommonProps> = ({
  syntax,
  text,
  nodes,
  state,
  setTextAndState,
  disabled,
  indentLabel = ItemizationMenuConstants.items.indent.defaultLabel,
  outdentLabel = ItemizationMenuConstants.items.outdent.defaultLabel,
}) => {
  const [open, anchorEl, onOpen, onClose] = useDropdownMenu();

  return (
    <DropdownMenu>
      <DropdownMenuAnchor
        open={open}
        onOpen={onOpen}
        onClose={onClose}
        disabled={disabled}
        data-testid={createTestId(ItemizationMenuConstants.testId)}
      >
        <ItemizationIcon />
      </DropdownMenuAnchor>
      <DropdownMenuList open={open} anchorEl={anchorEl}>
        <DropdownMenuItem data-testid={createTestId(ItemizationMenuConstants.items.indent.testId)}>
          {indentLabel}
        </DropdownMenuItem>
        <DropdownMenuItem data-testid={createTestId(ItemizationMenuConstants.items.outdent.testId)}>
          {outdentLabel}
        </DropdownMenuItem>
      </DropdownMenuList>
    </DropdownMenu>
  );
};

const BoldMenu: React.FC<BoldMenuProps & MenuCommonProps> = ({
  syntax,
  text,
  nodes,
  state,
  setTextAndState,
  disabled,
}) => (
  <IconButtonMenu disabled={disabled} data-testid={createTestId(BoldMenuConstants.testId)}>
    <BoldIcon />
  </IconButtonMenu>
);

const ItalicMenu: React.FC<ItalicMenuProps & MenuCommonProps> = ({
  syntax,
  text,
  nodes,
  state,
  setTextAndState,
  disabled,
}) => (
  <IconButtonMenu disabled={disabled} data-testid={createTestId(ItalicMenuConstants.testId)}>
    <ItalicIcon />
  </IconButtonMenu>
);

const UnderlineMenu: React.FC<UnderlineMenuProps & MenuCommonProps> = ({
  syntax,
  text,
  nodes,
  state,
  setTextAndState,
  disabled,
}) => (
  <IconButtonMenu disabled={disabled} data-testid={createTestId(UnderlineMenuConstants.testId)}>
    <UnderlineIcon />
  </IconButtonMenu>
);

const BracketMenu: React.FC<BracketMenuProps & MenuCommonProps> = ({
  suggestions,
  initialSuggestionIndex,
  syntax,
  text,
  nodes,
  state,
  setTextAndState,
  disabled,
}) => (
  <IconButtonMenu disabled={disabled} data-testid={createTestId(BracketMenuConstants.testId)}>
    <BracketIcon />
  </IconButtonMenu>
);

const HashtagMenu: React.FC<HashtagMenuProps & MenuCommonProps> = ({
  suggestions,
  initialSuggestionIndex,
  syntax,
  text,
  nodes,
  state,
  setTextAndState,
  disabled,
}) => (
  <IconButtonMenu disabled={disabled} data-testid={createTestId(HashtagMenuConstants.testId)}>
    <HashtagIcon />
  </IconButtonMenu>
);

const TaggedLinkMenu: React.FC<TaggedLinkMenuPropsMap & MenuCommonProps> = ({
  tags,
  syntax,
  text,
  nodes,
  state,
  setTextAndState,
  disabled,
}) => {
  const [open, anchorEl, onOpen, onClose] = useDropdownMenu();
  const tagEntries = Object.entries(tags || {});

  return (
    <DropdownMenu>
      <DropdownMenuAnchor
        open={open}
        onOpen={onOpen}
        onClose={onClose}
        disabled={disabled || tagEntries.length === 0}
        data-testid={createTestId(TaggedLinkMenuConstants.testId)}
      >
        <TaggedLinkIcon />
      </DropdownMenuAnchor>
      <DropdownMenuList open={open} anchorEl={anchorEl}>
        {tagEntries.map(([tagName, taggedLinkMenu]) => (
          <DropdownMenuItem key={tagName} data-testid={createTestId(TaggedLinkMenuConstants.items.testId(tagName))}>
            {taggedLinkMenu.label || TaggedLinkMenuConstants.items.defaultLabel(tagName)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuList>
    </DropdownMenu>
  );
};

const CodeMenu: React.FC<CodeMenuProps & MenuCommonProps> = ({
  syntax,
  text,
  nodes,
  state,
  setTextAndState,
  disabled,
  inlineLabel = CodeMenuConstants.items.inline.defaultLabel,
  blockLabel = CodeMenuConstants.items.block.defaultLabel,
}) => {
  const [open, anchorEl, onOpen, onClose] = useDropdownMenu();

  return (
    <DropdownMenu>
      <DropdownMenuAnchor
        open={open}
        onOpen={onOpen}
        onClose={onClose}
        disabled={disabled}
        data-testid={createTestId(CodeMenuConstants.testId)}
      >
        <CodeIcon />
      </DropdownMenuAnchor>
      <DropdownMenuList open={open} anchorEl={anchorEl}>
        <DropdownMenuItem data-testid={createTestId(CodeMenuConstants.items.inline.testId)}>
          {inlineLabel}
        </DropdownMenuItem>
        <DropdownMenuItem data-testid={createTestId(CodeMenuConstants.items.block.testId)}>
          {blockLabel}
        </DropdownMenuItem>
      </DropdownMenuList>
    </DropdownMenu>
  );
};

const FormulaMenu: React.FC<FormulaMenuProps & MenuCommonProps> = ({
  syntax,
  text,
  nodes,
  state,
  setTextAndState,
  disabled,
  inlineLabel = FormulaMenuConstants.items.inline.defaultLabel,
  displayLabel = FormulaMenuConstants.items.display.defaultLabel,
  blockLabel = FormulaMenuConstants.items.block.defaultLabel,
}) => {
  const [open, anchorEl, onOpen, onClose] = useDropdownMenu();

  return (
    <DropdownMenu>
      <DropdownMenuAnchor
        open={open}
        onOpen={onOpen}
        onClose={onClose}
        disabled={disabled}
        data-testid={createTestId(FormulaMenuConstants.testId)}
      >
        <FormulaIcon />
      </DropdownMenuAnchor>
      <DropdownMenuList open={open} anchorEl={anchorEl}>
        <DropdownMenuItem data-testid={createTestId(FormulaMenuConstants.items.inline.testId)}>
          {inlineLabel}
        </DropdownMenuItem>
        <DropdownMenuItem data-testid={createTestId(FormulaMenuConstants.items.display.testId)}>
          {displayLabel}
        </DropdownMenuItem>
        <DropdownMenuItem data-testid={createTestId(FormulaMenuConstants.items.block.testId)}>
          {blockLabel}
        </DropdownMenuItem>
      </DropdownMenuList>
    </DropdownMenu>
  );
};

const QuotationMenu: React.FC<QuotationMenuProps & MenuCommonProps> = ({
  syntax,
  text,
  nodes,
  state,
  setTextAndState,
  disabled,
  indentLabel = QuotationMenuConstants.items.indent.defaultLabel,
  outdentLabel = QuotationMenuConstants.items.outdent.defaultLabel,
}) => {
  const [open, anchorEl, onOpen, onClose] = useDropdownMenu();

  return (
    <DropdownMenu>
      <DropdownMenuAnchor
        open={open}
        onOpen={onOpen}
        onClose={onClose}
        disabled={disabled}
        data-testid={createTestId(QuotationMenuConstants.testId)}
      >
        <QuotationIcon />
      </DropdownMenuAnchor>
      <DropdownMenuList open={open} anchorEl={anchorEl}>
        <DropdownMenuItem data-testid={createTestId(QuotationMenuConstants.items.indent.testId)}>
          {indentLabel}
        </DropdownMenuItem>
        <DropdownMenuItem data-testid={createTestId(QuotationMenuConstants.items.outdent.testId)}>
          {outdentLabel}
        </DropdownMenuItem>
      </DropdownMenuList>
    </DropdownMenu>
  );
};
