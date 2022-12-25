import { DecorationMenuHandlerProps, handleOnDecorationClick } from '../callbacks/decoration';
import { decorationMenuSwitch } from '../switches/decoration';
import { BoldMenuProps } from 'src/components/molecules/menu/BoldMenu';
import { LineNode } from 'src/parser/line/types';

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
