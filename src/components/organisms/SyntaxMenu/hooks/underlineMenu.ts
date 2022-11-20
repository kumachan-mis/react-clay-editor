import { LineNode } from '../../../../parser/line/types';
import { ItalicMenuProps } from '../../../molecules/menu/ItalicMenu';
import { DecorationMenuHandlerProps, handleOnDecorationClick } from '../callbacks/decoration';
import { decorationMenuSwitch } from '../switches/decoration';

import { ContentPosition } from './contentPosition';
import { CommonMenuProps } from './types';

export function useUnderlineMenu(
  lineNodes: LineNode[],
  contentPosition: ContentPosition | undefined,
  { text, state, setTextAndState, syntax }: CommonMenuProps
): ItalicMenuProps {
  const menuSwitch = decorationMenuSwitch(syntax, lineNodes, contentPosition);
  const handlerProps: DecorationMenuHandlerProps = { syntax };

  const onButtonClick = () =>
    setTextAndState(
      ...handleOnDecorationClick(text, lineNodes, contentPosition, state, handlerProps, 'underline', menuSwitch)
    );

  return { menuSwitch: menuSwitch.underline, onButtonClick };
}
