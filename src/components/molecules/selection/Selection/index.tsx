import React from 'react';

import { SelectionRect } from '../../../atoms/selection/SelectionRect';

import { useSelection } from './hooks';
import { SelectionProps } from './types';

export const Selection: React.FC<SelectionProps> = (props) => {
  const { state, ref } = useSelection(props);

  return (
    <span ref={ref}>
      {state.topRectProps && <SelectionRect {...state.topRectProps} />}
      {state.centerRectProps && <SelectionRect {...state.centerRectProps} />}
      {state.bottomRectProps && <SelectionRect {...state.bottomRectProps} />}
    </span>
  );
};
