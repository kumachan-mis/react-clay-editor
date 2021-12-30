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
  ItemizeIcon,
  QuoteIcon,
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
} from './types';

export const SyntaxMenu: React.FC<SyntaxMenuProps & MenuCommonProps> = ({
  section,
  bracket,
  hashtag,
  taggedLink,
  code,
  formula,
  editorState,
  setEditorState,
}) => (
  <MenuContainer>
    <SectionMenu editorState={editorState} setEditorState={setEditorState} {...section} />
    <ItemizeMenu editorState={editorState} setEditorState={setEditorState} />
    <BoldMenu editorState={editorState} setEditorState={setEditorState} />
    <ItalicMenu editorState={editorState} setEditorState={setEditorState} />
    <UnderlineMenu editorState={editorState} setEditorState={setEditorState} />
    <BracketMenu editorState={editorState} setEditorState={setEditorState} {...bracket} />
    <HashtagMenu editorState={editorState} setEditorState={setEditorState} {...hashtag} />
    <TaggedLinkMenu editorState={editorState} setEditorState={setEditorState} {...taggedLink} />
    <CodeMenu editorState={editorState} setEditorState={setEditorState} {...code} />
    <FormulaMenu editorState={editorState} setEditorState={setEditorState} {...formula} />
    <QuoteMenu editorState={editorState} setEditorState={setEditorState} />
  </MenuContainer>
);

const SectionMenu: React.FC<SectionMenuProps & MenuCommonProps> = ({
  normalLabel,
  largerLabel,
  largestLabel,
  editorState,
  setEditorState,
  disabled,
}) => {
  const [open, anchorEl, onOpen, onClose] = useDropdownMenu();
  const constants = SyntaxMenuConstants.section;

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
        <DropdownMenuItem data-testid={createTestId(constants.items.normal.testId)}>
          {normalLabel || constants.items.normal.defaultLabel}
        </DropdownMenuItem>
        <DropdownMenuItem data-testid={createTestId(constants.items.normal.testId)}>
          {largerLabel || constants.items.larger.defaultLabel}
        </DropdownMenuItem>
        <DropdownMenuItem data-testid={createTestId(constants.items.normal.testId)}>
          {largestLabel || constants.items.largest.defaultLabel}
        </DropdownMenuItem>
      </DropdownMenuList>
    </DropdownMenu>
  );
};

const ItemizeMenu: React.FC<MenuCommonProps> = ({ editorState, setEditorState, disabled }) => {
  const constants = SyntaxMenuConstants.itemize;

  return (
    <IconButtonMenu disabled={disabled} data-testid={createTestId(constants.testId)}>
      <ItemizeIcon />
    </IconButtonMenu>
  );
};

const BoldMenu: React.FC<MenuCommonProps> = ({ editorState, setEditorState, disabled }) => {
  const constants = SyntaxMenuConstants.bold;

  return (
    <IconButtonMenu disabled={disabled} data-testid={createTestId(constants.testId)}>
      <BoldIcon />
    </IconButtonMenu>
  );
};

const ItalicMenu: React.FC<MenuCommonProps> = ({ editorState, setEditorState, disabled }) => {
  const constants = SyntaxMenuConstants.italic;

  return (
    <IconButtonMenu disabled={disabled} data-testid={createTestId(constants.testId)}>
      <ItalicIcon />
    </IconButtonMenu>
  );
};

const UnderlineMenu: React.FC<MenuCommonProps> = ({ editorState, setEditorState, disabled }) => {
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
  editorState,
  setEditorState,
  disabled,
}) => {
  const [open, anchorEl, onOpen, onClose] = useDropdownMenu();
  const tagEntries = Object.entries(tags);
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
  editorState,
  setEditorState,
  disabled,
}) => {
  const [open, anchorEl, onOpen, onClose] = useDropdownMenu();
  const constants = SyntaxMenuConstants.code;

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
        <DropdownMenuItem data-testid={createTestId(constants.items.inline.testId)}>
          {inlineLabel || constants.items.inline.defaultLabel}
        </DropdownMenuItem>
        <DropdownMenuItem data-testid={createTestId(constants.items.block.testId)}>
          {blockLabel || constants.items.block.defaultLabel}
        </DropdownMenuItem>
      </DropdownMenuList>
    </DropdownMenu>
  );
};

const FormulaMenu: React.FC<FormulaMenuProps & MenuCommonProps> = ({
  inlineLabel,
  displayLabel,
  blockLabel,
  editorState,
  setEditorState,
  disabled,
}) => {
  const [open, anchorEl, onOpen, onClose] = useDropdownMenu();
  const constants = SyntaxMenuConstants.formula;

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
        <DropdownMenuItem data-testid={createTestId(constants.items.inline.testId)}>
          {inlineLabel || constants.items.inline.defaultLabel}
        </DropdownMenuItem>
        <DropdownMenuItem data-testid={createTestId(constants.items.display.testId)}>
          {displayLabel || constants.items.display.defaultLabel}
        </DropdownMenuItem>
        <DropdownMenuItem data-testid={createTestId(constants.items.block.testId)}>
          {blockLabel || constants.items.block.defaultLabel}
        </DropdownMenuItem>
      </DropdownMenuList>
    </DropdownMenu>
  );
};

const QuoteMenu: React.FC<MenuCommonProps> = ({ editorState, setEditorState, disabled }) => {
  const constants = SyntaxMenuConstants.quote;

  return (
    <IconButtonMenu disabled={disabled} data-testid={createTestId(constants.testId)}>
      <QuoteIcon />
    </IconButtonMenu>
  );
};
