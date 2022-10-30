import React from 'react';

import { SelectionRect } from '../components/atoms/SelectionRect';

import { Props, State } from './types';
import { selectionPropsToState } from './utils';

export const Selection: React.FC<Props> = (props) => {
  const [state, setState] = React.useState<State>({
    topRectProps: undefined,
    centerRectProps: undefined,
    bottomRectProps: undefined,
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
      {state.topRectProps && <SelectionRect {...state.topRectProps} />}
      {state.centerRectProps && <SelectionRect {...state.centerRectProps} />}
      {state.bottomRectProps && <SelectionRect {...state.bottomRectProps} />}
    </span>
  );
};
