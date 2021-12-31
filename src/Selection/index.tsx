import React from 'react';

import { createTestId } from '../common/utils';

import { SelectionConstants } from './constants';
import { Props, State } from './types';
import { selectionPropsToState } from './utils';

export const Selection: React.FC<Props> = (props) => {
  const [state, setState] = React.useState<State>({
    topDivPosition: undefined,
    centerDivPosition: undefined,
    bottomDivPosition: undefined,
  });
  const rootRef = React.useRef<HTMLSpanElement | null>(null);

  const handleOnEditorResize = React.useCallback((): void => {
    if (!rootRef.current) return;
    const newState = selectionPropsToState(props, rootRef.current);
    if (newState !== state) setState(newState);
  }, [props, state]);

  React.useEffect(() => {
    window.addEventListener('resize', handleOnEditorResize);
    return () => {
      window.removeEventListener('resize', handleOnEditorResize);
    };
  }, [handleOnEditorResize]);

  React.useEffect(() => {
    if (!rootRef.current) return;
    const newState = selectionPropsToState(props, rootRef.current);
    if (newState !== state) setState(newState);
    // state should not be in dependencies because of infinite recursion
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  return (
    <span ref={rootRef}>
      {state.topDivPosition && (
        <div
          className={SelectionConstants.div.className}
          style={SelectionConstants.div.style(state.topDivPosition)}
          data-testid={createTestId(SelectionConstants.div.testId)}
        />
      )}
      {state.centerDivPosition && (
        <div
          className={SelectionConstants.div.className}
          style={SelectionConstants.div.style(state.centerDivPosition)}
          data-testid={createTestId(SelectionConstants.div.testId)}
        />
      )}
      {state.bottomDivPosition && (
        <div
          className={SelectionConstants.div.className}
          style={SelectionConstants.div.style(state.bottomDivPosition)}
          data-testid={createTestId(SelectionConstants.div.testId)}
        />
      )}
    </span>
  );
};
