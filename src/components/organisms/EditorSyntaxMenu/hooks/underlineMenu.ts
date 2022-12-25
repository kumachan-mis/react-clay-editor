import { DecorationMenuHandlerProps, handleOnDecorationClick } from '../callbacks/decoration';
import { decorationMenuSwitch } from '../switches/decoration';
import { ItalicMenuProps } from 'src/components/molecules/menu/ItalicMenu';
import { LineNode } from 'src/parser/line/types';

import { ContentPosition } from './contentPosition';
import { CommonMenuProps } from './types';

export function useUnderlineMenu(
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
      'underline',
      menuSwitch
    );
    setText(newText);
    setState(newState);
  };

  return { menuSwitch: menuSwitch.underline, onButtonClick };
}
