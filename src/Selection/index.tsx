import React from 'react';

import { selectIdProps } from '../common/utils';

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
  }, [props, state, setState, rootRef]);

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
  }, [props, rootRef]);

  return (
    <span ref={rootRef}>
      {state.topDivPosition && (
        <div
          className={SelectionConstants.div.className}
          style={SelectionConstants.div.style(state.topDivPosition)}
          {...selectIdProps(SelectionConstants.div.selectId)}
        />
      )}
      {state.centerDivPosition && (
        <div
          className={SelectionConstants.div.className}
          style={SelectionConstants.div.style(state.centerDivPosition)}
          {...selectIdProps(SelectionConstants.div.selectId)}
        />
      )}
      {state.bottomDivPosition && (
        <div
          className={SelectionConstants.div.className}
          style={SelectionConstants.div.style(state.bottomDivPosition)}
          {...selectIdProps(SelectionConstants.div.selectId)}
        />
      )}
    </span>
  );
};
