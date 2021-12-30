import * as React from 'react';

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

export const SyntaxMenu: React.FC = () => (
  <MenuContainer>
    <SectionMenu />
    <ItemizeMenu />
    <BoldMenu />
    <ItalicMenu />
    <UnderlineMenu />
    <BracketMenu />
    <HashtagMenu />
    <TaggedLinkMenu />
    <CodeMenu />
    <FormulaMenu />
    <QuoteMenu />
  </MenuContainer>
);

const SectionMenu: React.FC = () => {
  const [open, anchorEl, onOpen, onClose] = useDropdownMenu();
  const constants = SyntaxMenuConstants.section;

  return (
    <DropdownMenu onClose={onClose}>
      <DropdownMenuAnchor open={open} onOpen={onOpen} onClose={onClose}>
        <SectionIcon />
      </DropdownMenuAnchor>
      <DropdownMenuList open={open} anchorEl={anchorEl}>
        <DropdownMenuItem>{constants.defaultLabels.normal}</DropdownMenuItem>
        <DropdownMenuItem>{constants.defaultLabels.larger}</DropdownMenuItem>
        <DropdownMenuItem>{constants.defaultLabels.largest}</DropdownMenuItem>
      </DropdownMenuList>
    </DropdownMenu>
  );
};

const ItemizeMenu: React.FC = () => (
  <IconButtonMenu>
    <ItemizeIcon />
  </IconButtonMenu>
);

const BoldMenu: React.FC = () => (
  <IconButtonMenu>
    <BoldIcon />
  </IconButtonMenu>
);

const ItalicMenu: React.FC = () => (
  <IconButtonMenu>
    <ItalicIcon />
  </IconButtonMenu>
);

const UnderlineMenu: React.FC = () => (
  <IconButtonMenu>
    <UnderlineIcon />
  </IconButtonMenu>
);

const BracketMenu: React.FC = () => (
  <IconButtonMenu>
    <BracketIcon />
  </IconButtonMenu>
);

const HashtagMenu: React.FC = () => (
  <IconButtonMenu>
    <HashtagIcon />
  </IconButtonMenu>
);

const TaggedLinkMenu: React.FC = () => (
  <IconButtonMenu>
    <TaggedLinkIcon />
  </IconButtonMenu>
);

const CodeMenu: React.FC = () => {
  const [open, anchorEl, onOpen, onClose] = useDropdownMenu();
  const constants = SyntaxMenuConstants.code;

  return (
    <DropdownMenu onClose={onClose}>
      <DropdownMenuAnchor open={open} onOpen={onOpen} onClose={onClose}>
        <CodeIcon />
      </DropdownMenuAnchor>
      <DropdownMenuList open={open} anchorEl={anchorEl}>
        <DropdownMenuItem>{constants.defaultLabels.inline}</DropdownMenuItem>
        <DropdownMenuItem>{constants.defaultLabels.block}</DropdownMenuItem>
      </DropdownMenuList>
    </DropdownMenu>
  );
};

const FormulaMenu: React.FC = () => {
  const [open, anchorEl, onOpen, onClose] = useDropdownMenu();
  const constants = SyntaxMenuConstants.formula;

  return (
    <DropdownMenu onClose={onClose}>
      <DropdownMenuAnchor open={open} onOpen={onOpen} onClose={onClose}>
        <FormulaIcon />
      </DropdownMenuAnchor>
      <DropdownMenuList open={open} anchorEl={anchorEl}>
        <DropdownMenuItem>{constants.defaultLabels.inline}</DropdownMenuItem>
        <DropdownMenuItem>{constants.defaultLabels.display}</DropdownMenuItem>
        <DropdownMenuItem>{constants.defaultLabels.block}</DropdownMenuItem>
      </DropdownMenuList>
    </DropdownMenu>
  );
};

const QuoteMenu: React.FC = () => (
  <IconButtonMenu>
    <QuoteIcon />
  </IconButtonMenu>
);
