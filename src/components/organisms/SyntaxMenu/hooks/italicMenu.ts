import { LineNode } from '../../../../parser/line/types';
import { ItalicMenuProps } from '../../../molecules/menu/ItalicMenu';
import { DecorationMenuHandlerProps, handleOnDecorationClick } from '../callbacks/decoration';
import { decorationMenuSwitch } from '../switches/decoration';

import { ContentPosition } from './contentPosition';
import { CommonMenuProps } from './types';

export function useItalicMenu(
  lineNodes: LineNode[],
  contentPosition: ContentPosition | undefined,
  { text, state, setText, setState, syntax }: CommonMenuProps
): ItalicMenuProps {
  const menuSwitch = decorationMenuSwitch(syntax, lineNodes, contentPosition);
  const handlerProps: DecorationMenuHandlerProps = { syntax };

  const onButtonClick = () => {
    const [newText, newState] = handleOnDecorationClick(
      text,
      lineNodes,
      contentPosition,
      state,
      handlerProps,
      'italic',
      menuSwitch
    );
    setText(newText);
    setState(newState);
  };

  return { menuSwitch: menuSwitch.italic, onButtonClick };
}
