import * as React from "react";

import { Props, State } from "./types";
import { SelectionConstants } from "./constants";
import { selectionPropsToState } from "./utils";

export class Selection extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      topDivPosition: undefined,
      centerDivPosition: undefined,
      bottomDivPosition: undefined,
    };
  }

  componentDidUpdate(prevProps: Readonly<Props>): void {
    if (prevProps == this.props) return;
    const state = selectionPropsToState(this.props);
    this.setState(state);
  }

  render(): JSX.Element {
    return (
      <>
        {this.state.topDivPosition && (
          <div style={SelectionConstants.div.style(this.state.topDivPosition)} />
        )}
        {this.state.centerDivPosition && (
          <div style={SelectionConstants.div.style(this.state.centerDivPosition)} />
        )}
        {this.state.bottomDivPosition && (
          <div style={SelectionConstants.div.style(this.state.bottomDivPosition)} />
        )}
      </>
    );
  }
}
