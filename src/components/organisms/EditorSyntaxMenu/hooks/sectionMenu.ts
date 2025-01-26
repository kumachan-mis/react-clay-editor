import { EditorTextProps } from '../../../../contexts/EditorPropsContext';
import { LineNode } from '../../../../parser/line/lineNode';
import { SectionMenuConstants, SectionMenuProps } from '../../../molecules/menu/SectionMenu';
import { handleOnSectionButtonClick, handleOnSectionItemClick, SectionMenuHandlerProps } from '../callbacks/section';
import { sectionMenuSwitch } from '../switches/section';

import { CommonMenuProps } from './types';

const defaultHandlerProps: SectionMenuHandlerProps = {
  normalLabel: SectionMenuConstants.items.normal.defaultLabel,
  largerLabel: SectionMenuConstants.items.larger.defaultLabel,
  largestLabel: SectionMenuConstants.items.largest.defaultLabel,
};

export function useSectionMenu(
  lineNodes: LineNode[],
  textProps: EditorTextProps | undefined,
  { text, state, setText, setState, syntax }: CommonMenuProps,
): SectionMenuProps {
  const menuSwitch = sectionMenuSwitch(syntax, lineNodes, state);
  const handlerProps: SectionMenuHandlerProps = { ...defaultHandlerProps, ...textProps, syntax };
  const { normalLabel, largerLabel, largestLabel } = handlerProps;

  const onButtonClick = () => {
    const [newText, newState] = handleOnSectionButtonClick(text, lineNodes, state, handlerProps, menuSwitch);
    setText(newText);
    setState(newState);
  };

  const onNormalItemClick = () => {
    const [newText, newState] = handleOnSectionItemClick(text, lineNodes, state, handlerProps, 'normal', menuSwitch);
    setText(newText);
    setState(newState);
  };

  const onLargerItemClick = () => {
    const [newText, newState] = handleOnSectionItemClick(text, lineNodes, state, handlerProps, 'larger', menuSwitch);
    setText(newText);
    setState(newState);
  };

  const onLargestItemClick = () => {
    const [newText, newState] = handleOnSectionItemClick(text, lineNodes, state, handlerProps, 'largest', menuSwitch);
    setText(newText);
    setState(newState);
  };

  return {
    menuSwitch,
    normalLabel,
    largerLabel,
    largestLabel,
    onButtonClick,
    onNormalItemClick,
    onLargerItemClick,
    onLargestItemClick,
  };
}
