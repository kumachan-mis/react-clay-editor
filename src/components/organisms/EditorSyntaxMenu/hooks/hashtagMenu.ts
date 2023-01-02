import { EditorHashtagProps } from '../../../../contexts/EditorPropsContext';
import { LineNode } from '../../../../parser/line/types';
import { HashtagMenuConstants, HashtagMenuProps } from '../../../molecules/menu/HashtagMenu';
import { handleOnLinkItemClick, LinkMenuHandlerProps } from '../callbacks/link';
import { LinkMenuItem, linkMenuSwitch } from '../switches/link';

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
  hashtagProps: EditorHashtagProps | undefined,
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
