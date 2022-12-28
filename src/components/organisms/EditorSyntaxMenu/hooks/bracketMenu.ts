import { LinkMenuHandlerProps, handleOnLinkItemClick } from '../callbacks/link';
import { linkMenuSwitch, LinkMenuItem } from '../switches/link';
import { BracketMenuConstants, BracketMenuProps } from 'src/components/molecules/menu/BracketMenu';
import { EditorBracketLinkProps } from 'src/contexts/EditorPropsContext';
import { LineNode } from 'src/parser/line/types';

import { ContentPosition } from './contentPosition';
import { CommonMenuProps } from './types';

const defaultHandlerProps: LinkMenuHandlerProps = {
  label: BracketMenuConstants.defaultLabel,
  suggestions: [],
  initialSuggestionIndex: 0,
};

export function useBracketMenu(
  lineNodes: LineNode[],
  contentPosition: ContentPosition | undefined,
  bracketProps: EditorBracketLinkProps | undefined,
  { text, state, setText, setState, syntax }: CommonMenuProps
): BracketMenuProps {
  const menuSwitch = bracketProps?.disabled ? 'disabled' : linkMenuSwitch(lineNodes, contentPosition, 'bracketLink');
  const handlerProps: LinkMenuHandlerProps = { ...defaultHandlerProps, ...bracketProps, syntax };
  const menuItem: LinkMenuItem = { type: 'bracketLink' };

  const onButtonClick = () => {
    const [newText, newState] = handleOnLinkItemClick(
      text,
      lineNodes,
      contentPosition,
      state,
      handlerProps,
      menuItem,
      menuSwitch
    );
    setText(newText);
    setState(newState);
  };

  return { menuSwitch, onButtonClick };
}
