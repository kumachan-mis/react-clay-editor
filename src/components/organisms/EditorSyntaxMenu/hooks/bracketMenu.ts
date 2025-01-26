import { EditorBracketLinkProps } from '../../../../contexts/EditorPropsContext';
import { LineNode } from '../../../../parser/line/lineNode';
import { BracketMenuConstants, BracketMenuProps } from '../../../molecules/menu/BracketMenu';
import { handleOnLinkItemClick, LinkMenuHandlerProps } from '../callbacks/link';
import { LinkMenuItem, linkMenuSwitch } from '../switches/link';

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
  { text, state, setText, setState, syntax }: CommonMenuProps,
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
      menuSwitch,
    );
    setText(newText);
    setState(newState);
  };

  return { menuSwitch, onButtonClick };
}
