import * as React from 'react';

import { createTestId } from '../common/utils';

import {
  MenuContainer,
  DropdownMenu,
  DropdownMenuAnchor,
  DropdownMenuList,
  DropdownMenuItem,
  IconButtonMenu,
} from './components';
import { useDropdownMenu } from './components/hooks';
import { SyntaxMenuConstants } from './constants';
import {
  BoldIcon,
  BracketIcon,
  CodeIcon,
  FormulaIcon,
  HashtagIcon,
  ItalicIcon,
  ItemizationIcon,
  QuotationIcon,
  SectionIcon,
  TaggedLinkIcon,
  UnderlineIcon,
} from './icons';
import {
  BracketMenuProps,
  CodeMenuProps,
  MenuCommonProps,
  FormulaMenuProps,
  HashtagMenuProps,
  SectionMenuProps,
  SyntaxMenuProps,
  TaggedLinkMenuPropsMap,
  ItemizationMenuProps,
  QuotationMenuProps,
} from './types';

export const SyntaxMenu: React.FC<SyntaxMenuProps> = ({
  editorState,
  setEditorState,
  syntax = 'bracket',
  section,
  itemization,
  bracket,
  hashtag,
  taggedLink,
  code,
  formula,
  quotation,
  containerProps,
}) => (
  <MenuContainer {...containerProps}>
    <SectionMenu syntax={syntax} editorState={editorState} setEditorState={setEditorState} {...section} />
    <ItemizationMenu syntax={syntax} editorState={editorState} setEditorState={setEditorState} {...itemization} />
    <BoldMenu syntax={syntax} editorState={editorState} setEditorState={setEditorState} />
    <ItalicMenu syntax={syntax} editorState={editorState} setEditorState={setEditorState} />
    <UnderlineMenu syntax={syntax} editorState={editorState} setEditorState={setEditorState} />
    <BracketMenu syntax={syntax} editorState={editorState} setEditorState={setEditorState} {...bracket} />
    <HashtagMenu syntax={syntax} editorState={editorState} setEditorState={setEditorState} {...hashtag} />
    <TaggedLinkMenu syntax={syntax} editorState={editorState} setEditorState={setEditorState} {...taggedLink} />
    <CodeMenu syntax={syntax} editorState={editorState} setEditorState={setEditorState} {...code} />
    <FormulaMenu syntax={syntax} editorState={editorState} setEditorState={setEditorState} {...formula} />
    <QuotationMenu syntax={syntax} editorState={editorState} setEditorState={setEditorState} {...quotation} />
  </MenuContainer>
);

const SectionMenu: React.FC<SectionMenuProps & MenuCommonProps> = ({
  normalLabel,
  largerLabel,
  largestLabel,
  syntax,
  editorState,
  setEditorState,
  disabled,
}) => {
  const [open, anchorEl, onOpen, onClose] = useDropdownMenu();
  const constants = SyntaxMenuConstants.section;

  normalLabel ||= constants.items.normal.defaultLabel;
  largerLabel ||= constants.items.larger.defaultLabel;
  largestLabel ||= constants.items.largest.defaultLabel;

  return (
    <DropdownMenu onClose={onClose}>
      <DropdownMenuAnchor
        open={open}
        onOpen={onOpen}
        onClose={onClose}
        disabled={disabled}
        data-testid={createTestId(constants.testId)}
      >
        <SectionIcon />
      </DropdownMenuAnchor>
      <DropdownMenuList open={open} anchorEl={anchorEl}>
        <DropdownMenuItem data-testid={createTestId(constants.items.normal.testId)}>{normalLabel}</DropdownMenuItem>
        <DropdownMenuItem data-testid={createTestId(constants.items.normal.testId)}>{largerLabel}</DropdownMenuItem>
        <DropdownMenuItem data-testid={createTestId(constants.items.normal.testId)}>{largestLabel}</DropdownMenuItem>
      </DropdownMenuList>
    </DropdownMenu>
  );
};

const ItemizationMenu: React.FC<ItemizationMenuProps & MenuCommonProps> = ({
  indentLabel,
  outdentLabel,
  syntax,
  editorState,
  setEditorState,
  disabled,
}) => {
  const [open, anchorEl, onOpen, onClose] = useDropdownMenu();
  const constants = SyntaxMenuConstants.itemization;

  indentLabel ||= constants.items.indent.defaultLabel;
  outdentLabel ||= constants.items.outdent.defaultLabel;

  return (
    <DropdownMenu onClose={onClose}>
      <DropdownMenuAnchor
        open={open}
        onOpen={onOpen}
        onClose={onClose}
        disabled={disabled}
        data-testid={createTestId(constants.testId)}
      >
        <ItemizationIcon />
      </DropdownMenuAnchor>
      <DropdownMenuList open={open} anchorEl={anchorEl}>
        <DropdownMenuItem data-testid={createTestId(constants.items.indent.testId)}>{indentLabel}</DropdownMenuItem>
        <DropdownMenuItem data-testid={createTestId(constants.items.outdent.testId)}>{outdentLabel}</DropdownMenuItem>
      </DropdownMenuList>
    </DropdownMenu>
  );
};

const BoldMenu: React.FC<MenuCommonProps> = ({ syntax, editorState, setEditorState, disabled }) => {
  const constants = SyntaxMenuConstants.bold;

  return (
    <IconButtonMenu disabled={disabled} data-testid={createTestId(constants.testId)}>
      <BoldIcon />
    </IconButtonMenu>
  );
};

const ItalicMenu: React.FC<MenuCommonProps> = ({ syntax, editorState, setEditorState, disabled }) => {
  const constants = SyntaxMenuConstants.italic;

  return (
    <IconButtonMenu disabled={disabled} data-testid={createTestId(constants.testId)}>
      <ItalicIcon />
    </IconButtonMenu>
  );
};

const UnderlineMenu: React.FC<MenuCommonProps> = ({ syntax, editorState, setEditorState, disabled }) => {
  const constants = SyntaxMenuConstants.underline;

  return (
    <IconButtonMenu disabled={disabled} data-testid={createTestId(constants.testId)}>
      <UnderlineIcon />
    </IconButtonMenu>
  );
};

const BracketMenu: React.FC<BracketMenuProps & MenuCommonProps> = ({
  suggestions,
  initialSuggestionIndex,
  syntax,
  editorState,
  setEditorState,
  disabled,
}) => {
  const constants = SyntaxMenuConstants.bracket;

  return (
    <IconButtonMenu disabled={disabled} data-testid={createTestId(constants.testId)}>
      <BracketIcon />
    </IconButtonMenu>
  );
};

const HashtagMenu: React.FC<HashtagMenuProps & MenuCommonProps> = ({
  suggestions,
  initialSuggestionIndex,
  syntax,
  editorState,
  setEditorState,
  disabled,
}) => {
  const constants = SyntaxMenuConstants.hashtag;

  return (
    <IconButtonMenu disabled={disabled} data-testid={createTestId(constants.testId)}>
      <HashtagIcon />
    </IconButtonMenu>
  );
};

const TaggedLinkMenu: React.FC<TaggedLinkMenuPropsMap & MenuCommonProps> = ({
  tags,
  syntax,
  editorState,
  setEditorState,
  disabled,
}) => {
  const [open, anchorEl, onOpen, onClose] = useDropdownMenu();
  const tagEntries = Object.entries(tags || {});
  const constants = SyntaxMenuConstants.taggedLink;

  return (
    <DropdownMenu onClose={onClose}>
      <DropdownMenuAnchor
        open={open}
        onOpen={onOpen}
        onClose={onClose}
        disabled={disabled || tagEntries.length === 0}
        data-testid={createTestId(constants.testId)}
      >
        <TaggedLinkIcon />
      </DropdownMenuAnchor>
      <DropdownMenuList open={open} anchorEl={anchorEl}>
        {tagEntries.map(([tagName, taggedLinkMenu]) => (
          <DropdownMenuItem key={tagName} data-testid={createTestId(constants.items.testId(tagName))}>
            {taggedLinkMenu.label || constants.items.defaultLabel(tagName)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuList>
    </DropdownMenu>
  );
};

const CodeMenu: React.FC<CodeMenuProps & MenuCommonProps> = ({
  inlineLabel,
  blockLabel,
  syntax,
  editorState,
  setEditorState,
  disabled,
}) => {
  const [open, anchorEl, onOpen, onClose] = useDropdownMenu();
  const constants = SyntaxMenuConstants.code;

  inlineLabel ||= constants.items.inline.defaultLabel;
  blockLabel ||= constants.items.block.defaultLabel;

  return (
    <DropdownMenu onClose={onClose}>
      <DropdownMenuAnchor
        open={open}
        onOpen={onOpen}
        onClose={onClose}
        disabled={disabled}
        data-testid={createTestId(constants.testId)}
      >
        <CodeIcon />
      </DropdownMenuAnchor>
      <DropdownMenuList open={open} anchorEl={anchorEl}>
        <DropdownMenuItem data-testid={createTestId(constants.items.inline.testId)}>{inlineLabel}</DropdownMenuItem>
        <DropdownMenuItem data-testid={createTestId(constants.items.block.testId)}>{blockLabel}</DropdownMenuItem>
      </DropdownMenuList>
    </DropdownMenu>
  );
};

const FormulaMenu: React.FC<FormulaMenuProps & MenuCommonProps> = ({
  inlineLabel,
  displayLabel,
  blockLabel,
  syntax,
  editorState,
  setEditorState,
  disabled,
}) => {
  const [open, anchorEl, onOpen, onClose] = useDropdownMenu();
  const constants = SyntaxMenuConstants.formula;

  inlineLabel ||= constants.items.inline.defaultLabel;
  displayLabel ||= constants.items.display.defaultLabel;
  blockLabel ||= constants.items.block.defaultLabel;

  return (
    <DropdownMenu onClose={onClose}>
      <DropdownMenuAnchor
        open={open}
        onOpen={onOpen}
        onClose={onClose}
        disabled={disabled}
        data-testid={createTestId(constants.testId)}
      >
        <FormulaIcon />
      </DropdownMenuAnchor>
      <DropdownMenuList open={open} anchorEl={anchorEl}>
        <DropdownMenuItem data-testid={createTestId(constants.items.inline.testId)}>{inlineLabel}</DropdownMenuItem>
        <DropdownMenuItem data-testid={createTestId(constants.items.display.testId)}>{displayLabel}</DropdownMenuItem>
        <DropdownMenuItem data-testid={createTestId(constants.items.block.testId)}>{blockLabel}</DropdownMenuItem>
      </DropdownMenuList>
    </DropdownMenu>
  );
};

const QuotationMenu: React.FC<QuotationMenuProps & MenuCommonProps> = ({
  indentLabel,
  outdentLabel,
  syntax,
  editorState,
  setEditorState,
  disabled,
}) => {
  const [open, anchorEl, onOpen, onClose] = useDropdownMenu();
  const constants = SyntaxMenuConstants.quotation;

  indentLabel ||= constants.items.indent.defaultLabel;
  outdentLabel ||= constants.items.outdent.defaultLabel;

  return (
    <DropdownMenu onClose={onClose}>
      <DropdownMenuAnchor
        open={open}
        onOpen={onOpen}
        onClose={onClose}
        disabled={disabled}
        data-testid={createTestId(constants.testId)}
      >
        <QuotationIcon />
      </DropdownMenuAnchor>
      <DropdownMenuList open={open} anchorEl={anchorEl}>
        <DropdownMenuItem data-testid={createTestId(constants.items.indent.testId)}>{indentLabel}</DropdownMenuItem>
        <DropdownMenuItem data-testid={createTestId(constants.items.outdent.testId)}>{outdentLabel}</DropdownMenuItem>
      </DropdownMenuList>
    </DropdownMenu>
  );
};
