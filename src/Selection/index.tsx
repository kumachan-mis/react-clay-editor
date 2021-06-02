import * as React from 'react';

import { Props, State } from './types';
import { SelectionConstants } from './constants';
import { selectionPropsToState } from './utils';

export const Selection: React.FC<Props> = (props) => {
  const [state, setState] = React.useState<State>({
    topDivPosition: undefined,
    centerDivPosition: undefined,
    bottomDivPosition: undefined,
  });
  const rootRef = React.useRef<HTMLSpanElement | null>(null);

  React.useEffect(() => {
    if (!rootRef.current) return;
    const newState = selectionPropsToState(props, rootRef.current);
    if (newState != state) setState(newState);
    // state should not be in dependencies because of infinite recursion
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props, rootRef]);

  return (
    <span ref={rootRef}>
      {state.topDivPosition && (
        <div className={SelectionConstants.div.className} style={SelectionConstants.div.style(state.topDivPosition)} />
      )}
      {state.centerDivPosition && (
        <div
          className={SelectionConstants.div.className}
          style={SelectionConstants.div.style(state.centerDivPosition)}
        />
      )}
      {state.bottomDivPosition && (
        <div
          className={SelectionConstants.div.className}
          style={SelectionConstants.div.style(state.bottomDivPosition)}
        />
      )}
    </span>
  );
};
