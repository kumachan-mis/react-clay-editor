import React from 'react';

import { createTestId } from '../../../../common/utils';
import { ItalicIcon } from '../../../../icons/ItalicIcon';
import { IconButtonMenu } from '../../../atoms/menu/IconButtonMenu';
import { DecorationMenuHandlerProps, handleOnDecorationClick } from '../callbacks/decoration';
import { CommonMenuProps, ContentMenuProps } from '../common/type';
import { decorationMenuSwitch } from '../switches/decoration';

export type ItalicMenuProps = ContentMenuProps & CommonMenuProps;

export const ItalicMenuConstants = {
  testId: 'italic-menu',
};

export const ItalicMenu: React.FC<ItalicMenuProps> = ({
  syntax,
  text,
  lineNodes: nodes,
  contentPosition,
  state,
  setTextAndState,
}) => {
  const props: DecorationMenuHandlerProps = { syntax };
  const menuSwitch = decorationMenuSwitch(syntax, nodes, contentPosition);

  return (
    <IconButtonMenu
      pressed={menuSwitch.italic === 'on'}
      disabled={menuSwitch.italic === 'disabled'}
      onClick={() =>
        setTextAndState(...handleOnDecorationClick(text, nodes, contentPosition, state, props, 'italic', menuSwitch))
      }
      data-testid={createTestId(ItalicMenuConstants.testId)}
    >
      <ItalicIcon />
    </IconButtonMenu>
  );
};
