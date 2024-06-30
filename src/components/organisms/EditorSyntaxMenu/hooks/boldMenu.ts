import { LineNode } from '../../../../parser/line/lineNode';
import { BoldMenuProps } from '../../../molecules/menu/BoldMenu';
import { DecorationMenuHandlerProps, handleOnDecorationClick } from '../callbacks/decoration';
import { decorationMenuSwitch } from '../switches/decoration';

import { ContentPosition } from './contentPosition';
import { CommonMenuProps } from './types';

export function useBoldMenu(
  lineNodes: LineNode[],
  contentPosition: ContentPosition | undefined,
  { text, state, setText, setState, syntax }: CommonMenuProps
): BoldMenuProps {
  const menuSwitch = decorationMenuSwitch(syntax, lineNodes, contentPosition);
  const handlerProps: DecorationMenuHandlerProps = { syntax };

  const onButtonClick = () => {
    const [newText, newState] = handleOnDecorationClick(
      text,
      lineNodes,
      contentPosition,
      state,
      handlerProps,
      'bold',
      menuSwitch
    );
    setText(newText);
    setState(newState);
  };

  return { menuSwitch: menuSwitch.bold, onButtonClick };
}
