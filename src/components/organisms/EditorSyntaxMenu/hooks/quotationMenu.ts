import {
  handleOnQuotationButtonClick,
  handleOnQuotationItemClick,
  QuotationMenuHandlerProps,
} from '../callbacks/quotation';
import { quotationMenuSwitch } from '../switches/quotation';
import { QuotationMenuConstants, QuotationMenuProps } from 'src/components/molecules/menu/QuotationMenu';
import { EditorQuotationProps } from 'src/contexts/EditorPropsContext';
import { LineNode } from 'src/parser/line/types';

import { CommonMenuProps } from './types';

const defaultHandlerProps: QuotationMenuHandlerProps = {
  indentLabel: QuotationMenuConstants.items.indent.defaultLabel,
  outdentLabel: QuotationMenuConstants.items.outdent.defaultLabel,
};

export function useQuotationMenu(
  lineNodes: LineNode[],
  quotationProps: EditorQuotationProps | undefined,
  { text, state, setText, setState, syntax }: CommonMenuProps
): QuotationMenuProps {
  const menuSwitch = quotationMenuSwitch(syntax, lineNodes, state);
  const handlerProps: QuotationMenuHandlerProps = { ...defaultHandlerProps, ...quotationProps, syntax };
  const { indentLabel, outdentLabel } = handlerProps;

  const onButtonClick = () => {
    const [newText, newState] = handleOnQuotationButtonClick(text, lineNodes, state, handlerProps, menuSwitch);
    setText(newText);
    setState(newState);
  };

  const onIndentItemClick = () => {
    const [newText, newState] = handleOnQuotationItemClick(text, lineNodes, state, handlerProps, 'indent', menuSwitch);
    setText(newText);
    setState(newState);
  };

  const onOutdentItemClick = () => {
    const [newText, newState] = handleOnQuotationItemClick(text, lineNodes, state, handlerProps, 'outdent', menuSwitch);
    setText(newText);
    setState(newState);
  };

  return { menuSwitch, indentLabel, outdentLabel, onButtonClick, onIndentItemClick, onOutdentItemClick };
}
