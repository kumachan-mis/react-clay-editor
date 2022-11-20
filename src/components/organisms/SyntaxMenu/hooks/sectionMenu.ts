import { LineNode } from '../../../../parser/line/types';
import { SectionMenuConstants, SectionMenuProps } from '../../../molecules/menu/SectionMenu';
import { handleOnSectionButtonClick, handleOnSectionItemClick, SectionMenuHandlerProps } from '../callbacks/section';
import { sectionMenuSwitch } from '../switches/section';
import { SectionProps } from '../types';

import { CommonMenuProps } from './types';

const defaultHandlerProps: SectionMenuHandlerProps = {
  normalLabel: SectionMenuConstants.items.normal.defaultLabel,
  largerLabel: SectionMenuConstants.items.larger.defaultLabel,
  largestLabel: SectionMenuConstants.items.largest.defaultLabel,
};

export function useSectionMenu(
  lineNodes: LineNode[],
  sectionProps: SectionProps | undefined,
  { text, state, onChangeText, setState, syntax }: CommonMenuProps
): SectionMenuProps {
  const menuSwitch = sectionMenuSwitch(syntax, lineNodes, state);
  const handlerProps: SectionMenuHandlerProps = { ...defaultHandlerProps, ...sectionProps, syntax };
  const { normalLabel, largerLabel, largestLabel } = handlerProps;

  const onButtonClick = () => {
    const [newText, newState] = handleOnSectionButtonClick(text, lineNodes, state, handlerProps, menuSwitch);
    onChangeText(newText);
    setState(newState);
  };

  const onNormalItemClick = () => {
    const [newText, newState] = handleOnSectionItemClick(text, lineNodes, state, handlerProps, 'normal', menuSwitch);
    onChangeText(newText);
    setState(newState);
  };

  const onLargerItemClick = () => {
    const [newText, newState] = handleOnSectionItemClick(text, lineNodes, state, handlerProps, 'larger', menuSwitch);
    onChangeText(newText);
    setState(newState);
  };

  const onLargestItemClick = () => {
    const [newText, newState] = handleOnSectionItemClick(text, lineNodes, state, handlerProps, 'largest', menuSwitch);
    onChangeText(newText);
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
