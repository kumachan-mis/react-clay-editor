import * as React from "react";

import { Props, State } from "./types";
import { SelectionConstants } from "./constants";
import { selectionPropsToState } from "./utils";
import "../style.css";

export const Selection: React.FC<Props> = (props) => {
  const [state, setState] = React.useState<State>({
    topDivPosition: undefined,
    centerDivPosition: undefined,
    bottomDivPosition: undefined,
  });
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const newState = selectionPropsToState(props, rootRef.current);
    if (newState != state) setState(newState);
  }, [props]);

  return (
    <span ref={rootRef}>
      {state.topDivPosition && (
        <div
          className={SelectionConstants.div.className}
          style={SelectionConstants.div.style(state.topDivPosition)}
        />
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
