import { LineNode } from '../../../../parser/line/types';
import { BoldMenuProps } from '../../../molecules/menu/BoldMenu';
import { DecorationMenuHandlerProps, handleOnDecorationClick } from '../callbacks/decoration';
import { decorationMenuSwitch } from '../switches/decoration';

import { ContentPosition } from './contentPosition';
import { CommonMenuProps } from './types';

export function useBoldMenu(
  lineNodes: LineNode[],
  contentPosition: ContentPosition | undefined,
  { text, state, setTextAndState, syntax }: CommonMenuProps
): BoldMenuProps {
  const menuSwitch = decorationMenuSwitch(syntax, lineNodes, contentPosition);
  const handlerProps: DecorationMenuHandlerProps = { syntax };

  const onButtonClick = () =>
    setTextAndState(
      ...handleOnDecorationClick(text, lineNodes, contentPosition, state, handlerProps, 'bold', menuSwitch)
    );

  return { menuSwitch: menuSwitch.bold, onButtonClick };
}