import { CursorSelection } from '../../../../types/selection/cursorSelection';
import { SelectionRect } from '../../../atoms/selection/SelectionRect';

import { useSelection } from './hooks';

export type SelectionProps = {
  readonly cursorSelection: CursorSelection | undefined;
  readonly lineIds: string[];
};

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
