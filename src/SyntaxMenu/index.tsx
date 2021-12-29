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
  TaggedlinkIcon,
  UnderlineIcon,
} from './icons';

export const SyntaxMenu: React.FC = () => {
  const [sectionOpen, sectionAnchorEl, onOpenSection, onCloseSection] = useDropdownMenu();
  const [codeOpen, codeAnchorEl, onOpenCode, onCloseCode] = useDropdownMenu();
  const [formulaOpen, formulaAnchorEl, onOpenFormula, onCloseFormula] = useDropdownMenu();

  return (
    <MenuContainer>
      <DropdownMenu onClose={onCloseSection}>
        <DropdownMenuAnchor open={sectionOpen} onOpen={onOpenSection} onClose={onCloseSection}>
          <SectionIcon />
        </DropdownMenuAnchor>
        <DropdownMenuList open={sectionOpen} anchorEl={sectionAnchorEl}>
          <DropdownMenuItem>section</DropdownMenuItem>
          <DropdownMenuItem>subsection</DropdownMenuItem>
        </DropdownMenuList>
      </DropdownMenu>
      <IconButtonMenu>
        <ItemizeIcon />
      </IconButtonMenu>
      <IconButtonMenu>
        <BoldIcon />
      </IconButtonMenu>
      <IconButtonMenu>
        <ItalicIcon />
      </IconButtonMenu>
      <IconButtonMenu>
        <UnderlineIcon />
      </IconButtonMenu>
      <IconButtonMenu>
        <BracketIcon />
      </IconButtonMenu>
      <IconButtonMenu>
        <HashtagIcon />
      </IconButtonMenu>
      <IconButtonMenu>
        <TaggedlinkIcon />
      </IconButtonMenu>
      <DropdownMenu onClose={onCloseCode}>
        <DropdownMenuAnchor open={codeOpen} onOpen={onOpenCode} onClose={onCloseCode}>
          <CodeIcon />
        </DropdownMenuAnchor>
        <DropdownMenuList open={codeOpen} anchorEl={codeAnchorEl}>
          <DropdownMenuItem>inline code</DropdownMenuItem>
          <DropdownMenuItem>block code</DropdownMenuItem>
        </DropdownMenuList>
      </DropdownMenu>
      <DropdownMenu onClose={onCloseFormula}>
        <DropdownMenuAnchor open={formulaOpen} onOpen={onOpenFormula} onClose={onCloseFormula}>
          <FormulaIcon />
        </DropdownMenuAnchor>
        <DropdownMenuList open={formulaOpen} anchorEl={formulaAnchorEl}>
          <DropdownMenuItem>inline formula</DropdownMenuItem>
          <DropdownMenuItem>display formula</DropdownMenuItem>
          <DropdownMenuItem>block formula</DropdownMenuItem>
        </DropdownMenuList>
      </DropdownMenu>
      <IconButtonMenu>
        <QuoteIcon />
      </IconButtonMenu>
    </MenuContainer>
  );
};
