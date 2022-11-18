import React from 'react';

import { QuotationLabels } from '../../../../common/types';
import { createTestId } from '../../../../common/utils';
import { QuotationIcon } from '../../../../icons/Quotation';
import { DropdownMenu } from '../../../atoms/menu/DropdownMenu';
import { useDropdownMenu } from '../../../atoms/menu/DropdownMenu/hooks';
import { DropdownMenuButton } from '../../../atoms/menu/DropdownMenuButton';
import { DropdownMenuList } from '../../../atoms/menu/DropdownMenuList';
import { DropdownMenuListItem } from '../../../atoms/menu/DropdownMenuListItem';
import {
  handleOnQuotationButtonClick,
  handleOnQuotationItemClick,
  QuotationMenuHandlerProps,
} from '../../../organisms/SyntaxMenu/callbacks/quotation';
import { CommonMenuProps, LineMenuProps } from '../../../organisms/SyntaxMenu/common/type';
import { quotationMenuSwitch } from '../../../organisms/SyntaxMenu/switches/quotation';

export type QuotationMenuProps = QuotationLabels & LineMenuProps & CommonMenuProps;

export const QuotationMenuConstants = {
  testId: 'quotation-menu',
  items: {
    indent: {
      defaultLabel: 'indent',
      testId: 'indent-quotation-menu-item',
    },
    outdent: {
      defaultLabel: 'outdent',
      testId: 'outdent-quotation-menu-item',
    },
  },
};

export const QuotationMenu: React.FC<QuotationMenuProps & LineMenuProps & CommonMenuProps> = ({
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
  const props: QuotationMenuHandlerProps = { syntax, indentLabel, outdentLabel };

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
