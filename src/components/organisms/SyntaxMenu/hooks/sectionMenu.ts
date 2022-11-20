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
  { text, state, setTextAndState, syntax }: CommonMenuProps
): SectionMenuProps {
  const menuSwitch = sectionMenuSwitch(syntax, lineNodes, state);
  const handlerProps: SectionMenuHandlerProps = { ...defaultHandlerProps, ...sectionProps, syntax };
  const { normalLabel, largerLabel, largestLabel } = handlerProps;

  const onButtonClick = () =>
    setTextAndState(...handleOnSectionButtonClick(text, lineNodes, state, handlerProps, menuSwitch));

  const onNormalItemClick = () =>
    setTextAndState(...handleOnSectionItemClick(text, lineNodes, state, handlerProps, 'normal', menuSwitch));

  const onLargerItemClick = () =>
    setTextAndState(...handleOnSectionItemClick(text, lineNodes, state, handlerProps, 'larger', menuSwitch));

  const onLargestItemClick = () =>
    setTextAndState(...handleOnSectionItemClick(text, lineNodes, state, handlerProps, 'largest', menuSwitch));

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
