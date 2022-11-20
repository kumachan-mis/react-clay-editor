import { LineNode } from '../../../../parser/line/types';
import { QuotationMenuConstants, QuotationMenuProps } from '../../../molecules/menu/QuotationMenu';
import {
  handleOnQuotationButtonClick,
  handleOnQuotationItemClick,
  QuotationMenuHandlerProps,
} from '../callbacks/quotation';
import { quotationMenuSwitch } from '../switches/quotation';
import { QuotationProps } from '../types';

import { CommonMenuProps } from './types';

const defaultHandlerProps: QuotationMenuHandlerProps = {
  indentLabel: QuotationMenuConstants.items.indent.defaultLabel,
  outdentLabel: QuotationMenuConstants.items.outdent.defaultLabel,
};

export function useQuotationMenu(
  lineNodes: LineNode[],
  quotationProps: QuotationProps | undefined,
  { text, state, setTextAndState, syntax }: CommonMenuProps
): QuotationMenuProps {
  const menuSwitch = quotationMenuSwitch(syntax, lineNodes, state);
  const handlerProps: QuotationMenuHandlerProps = { ...defaultHandlerProps, ...quotationProps, syntax };
  const { indentLabel, outdentLabel } = handlerProps;

  const onButtonClick = () =>
    setTextAndState(...handleOnQuotationButtonClick(text, lineNodes, state, handlerProps, menuSwitch));

  const onIndentItemClick = () =>
    setTextAndState(...handleOnQuotationItemClick(text, lineNodes, state, handlerProps, 'indent', menuSwitch));

  const onOutdentItemClick = () =>
    setTextAndState(...handleOnQuotationItemClick(text, lineNodes, state, handlerProps, 'outdent', menuSwitch));

  return { menuSwitch, indentLabel, outdentLabel, onButtonClick, onIndentItemClick, onOutdentItemClick };
}
