import React from 'react';

import { createTestId } from '../../../../common/utils';
import { BoldIcon } from '../../../../icons/BoldIcon';
import { IconButtonMenu } from '../../../atoms/menu/IconButtonMenu';
import { DecorationMenuHandlerProps, handleOnDecorationClick } from '../callbacks/decoration';
import { CommonMenuProps, ContentMenuProps } from '../common/type';
import { decorationMenuSwitch } from '../switches/decoration';

export type BoldMenuProps = ContentMenuProps & CommonMenuProps;

export const BoldMenuConstants = {
  testId: 'bold-menu',
};

export const BoldMenu: React.FC<BoldMenuProps> = ({
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
      pressed={menuSwitch.bold === 'on'}
      disabled={menuSwitch.bold === 'disabled'}
      onClick={() =>
        setTextAndState(...handleOnDecorationClick(text, nodes, contentPosition, state, props, 'bold', menuSwitch))
      }
      data-testid={createTestId(BoldMenuConstants.testId)}
    >
      <BoldIcon />
    </IconButtonMenu>
  );
};
