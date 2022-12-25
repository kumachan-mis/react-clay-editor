import { LinkMenuHandlerProps, handleOnLinkItemClick } from '../callbacks/link';
import { linkMenuSwitch, LinkMenuItem } from '../switches/link';
import { HashtagMenuConstants, HashtagMenuProps } from 'src/components/molecules/menu/HashtagMenu';
import { HashtagProps } from 'src/contexts/EditorPropsContext';
import { LineNode } from 'src/parser/line/types';

import { ContentPosition } from './contentPosition';
import { CommonMenuProps } from './types';

const defaultHandlerProps: LinkMenuHandlerProps = {
  label: HashtagMenuConstants.defaultLabel,
  suggestions: [],
  initialSuggestionIndex: 0,
};

export function useHashtagMenu(
  lineNodes: LineNode[],
  contentPosition: ContentPosition | undefined,
  hashtagProps: HashtagProps | undefined,
  { text, state, setText, setState, syntax }: CommonMenuProps
): HashtagMenuProps {
  const menuSwitch = hashtagProps?.disabled ? 'disabled' : linkMenuSwitch(lineNodes, contentPosition, 'hashtag');
  const handlerProps: LinkMenuHandlerProps = { ...defaultHandlerProps, ...hashtagProps, syntax };
  const menuItem: LinkMenuItem = { type: 'hashtag' };

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
