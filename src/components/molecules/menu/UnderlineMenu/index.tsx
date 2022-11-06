import React from 'react';

import { createTestId } from '../../../../common/utils';
import { UnderlineIcon } from '../../../../icons/UnderlineIcon';
import { IconButtonMenu } from '../../../atoms/menu/IconButtonMenu';
import { DecorationMenuHandlerProps, handleOnDecorationClick } from '../callbacks/decoration';
import { CommonMenuProps, ContentMenuProps } from '../common/type';
import { decorationMenuSwitch } from '../switches/decoration';

export type UnderlineMenuProps = ContentMenuProps & CommonMenuProps;

export const UnderlineMenuConstants = {
  testId: 'underline-menu',
};

export const UnderlineMenu: React.FC<UnderlineMenuProps> = ({
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
      pressed={menuSwitch.underline === 'on'}
      disabled={menuSwitch.underline === 'disabled'}
      onClick={() =>
        setTextAndState(...handleOnDecorationClick(text, nodes, contentPosition, state, props, 'underline', menuSwitch))
      }
      data-testid={createTestId(UnderlineMenuConstants.testId)}
    >
      <UnderlineIcon />
    </IconButtonMenu>
  );
};
