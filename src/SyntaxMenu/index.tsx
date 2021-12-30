import * as React from 'react';

import { selectIdProps } from '../common/utils';

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
    <DropdownMenu onClose={onClose} disabled={disabled}>
      <DropdownMenuAnchor open={open} onOpen={onOpen} onClose={onClose} {...selectIdProps(constants.selectId)}>
        <SectionIcon />
      </DropdownMenuAnchor>
      <DropdownMenuList open={open} anchorEl={anchorEl}>
        <DropdownMenuItem {...selectIdProps(constants.items.normal.selectId)}>
          {normalLabel || constants.items.normal.label}
        </DropdownMenuItem>
        <DropdownMenuItem {...selectIdProps(constants.items.normal.selectId)}>
          {largerLabel || constants.items.larger.label}
        </DropdownMenuItem>
        <DropdownMenuItem {...selectIdProps(constants.items.normal.selectId)}>
          {largestLabel || constants.items.largest.label}
        </DropdownMenuItem>
      </DropdownMenuList>
    </DropdownMenu>
  );
};

const ItemizeMenu: React.FC<MenuCommonProps> = ({ editorState, setEditorState, disabled }) => {
  const constants = SyntaxMenuConstants.itemize;

  return (
    <IconButtonMenu disabled={disabled} {...selectIdProps(constants.selectId)}>
      <ItemizeIcon />
    </IconButtonMenu>
  );
};

const BoldMenu: React.FC<MenuCommonProps> = ({ editorState, setEditorState, disabled }) => {
  const constants = SyntaxMenuConstants.bold;

  return (
    <IconButtonMenu disabled={disabled} {...selectIdProps(constants.selectId)}>
      <BoldIcon />
    </IconButtonMenu>
  );
};

const ItalicMenu: React.FC<MenuCommonProps> = ({ editorState, setEditorState, disabled }) => {
  const constants = SyntaxMenuConstants.italic;

  return (
    <IconButtonMenu disabled={disabled} {...selectIdProps(constants.selectId)}>
      <ItalicIcon />
    </IconButtonMenu>
  );
};

const UnderlineMenu: React.FC<MenuCommonProps> = ({ editorState, setEditorState, disabled }) => {
  const constants = SyntaxMenuConstants.underline;

  return (
    <IconButtonMenu disabled={disabled} {...selectIdProps(constants.selectId)}>
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
    <IconButtonMenu disabled={disabled} {...selectIdProps(constants.selectId)}>
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
    <IconButtonMenu disabled={disabled} {...selectIdProps(constants.selectId)}>
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
    <DropdownMenu onClose={onClose} disabled={disabled || tagEntries.length === 0}>
      <DropdownMenuAnchor open={open} onOpen={onOpen} onClose={onClose} {...selectIdProps(constants.selectId)}>
        <TaggedLinkIcon />
      </DropdownMenuAnchor>
      <DropdownMenuList open={open} anchorEl={anchorEl}>
        {tagEntries.map(([tagName, taggedLinkMenu]) => (
          <DropdownMenuItem key={tagName} {...selectIdProps(constants.items.selectId(tagName))}>
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
    <DropdownMenu onClose={onClose} disabled={disabled}>
      <DropdownMenuAnchor open={open} onOpen={onOpen} onClose={onClose} {...selectIdProps(constants.selectId)}>
        <CodeIcon />
      </DropdownMenuAnchor>
      <DropdownMenuList open={open} anchorEl={anchorEl}>
        <DropdownMenuItem {...selectIdProps(constants.items.inline.selectId)}>
          {inlineLabel || constants.items.inline.label}
        </DropdownMenuItem>
        <DropdownMenuItem {...selectIdProps(constants.items.block.selectId)}>
          {blockLabel || constants.items.block.label}
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
    <DropdownMenu onClose={onClose} disabled={disabled}>
      <DropdownMenuAnchor open={open} onOpen={onOpen} onClose={onClose} {...selectIdProps(constants.selectId)}>
        <FormulaIcon />
      </DropdownMenuAnchor>
      <DropdownMenuList open={open} anchorEl={anchorEl}>
        <DropdownMenuItem {...selectIdProps(constants.items.inline.selectId)}>
          {inlineLabel || constants.items.inline.label}
        </DropdownMenuItem>
        <DropdownMenuItem {...selectIdProps(constants.items.display.selectId)}>
          {displayLabel || constants.items.display.label}
        </DropdownMenuItem>
        <DropdownMenuItem {...selectIdProps(constants.items.block.selectId)}>
          {blockLabel || constants.items.block.label}
        </DropdownMenuItem>
      </DropdownMenuList>
    </DropdownMenu>
  );
};

const QuoteMenu: React.FC<MenuCommonProps> = ({ editorState, setEditorState, disabled }) => {
  const constants = SyntaxMenuConstants.quote;

  return (
    <IconButtonMenu disabled={disabled} {...selectIdProps(constants.selectId)}>
      <QuoteIcon />
    </IconButtonMenu>
  );
};
