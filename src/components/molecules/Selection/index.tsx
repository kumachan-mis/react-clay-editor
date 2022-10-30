import React from 'react';

import { SelectionRect } from '../../atoms/SelectionRect';

import { useSelection } from './hooks';
import { Props } from './types';

export const Selection: React.FC<Props> = (props) => {
  const { state, ref } = useSelection(props);

  return (
    <span ref={ref}>
      {state.topRectProps && <SelectionRect {...state.topRectProps} />}
      {state.centerRectProps && <SelectionRect {...state.centerRectProps} />}
      {state.bottomRectProps && <SelectionRect {...state.bottomRectProps} />}
    </span>
  );
};
