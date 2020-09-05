import * as React from "react";

import { Props, State } from "./types";
import { SelectionConstants } from "./constants";
import { selectionPropsToState } from "./utils";

export class Selection extends React.Component<Props, State> {
  private root: HTMLSpanElement | null;

  constructor(props: Props) {
    super(props);
    this.state = {
      topDivPosition: undefined,
      centerDivPosition: undefined,
      bottomDivPosition: undefined,
    };
    this.root = null;
  }

  componentDidUpdate(prevProps: Readonly<Props>): void {
    if (!this.root || prevProps == this.props) return;
    const state = selectionPropsToState(this.props, this.root);
    if (this.state != state) this.setState(state);
  }

  render(): React.ReactElement {
    return (
      <span ref={(root) => (this.root = root)}>
        {this.state.topDivPosition && (
          <div style={SelectionConstants.div.style(this.state.topDivPosition)} />
        )}
        {this.state.centerDivPosition && (
          <div style={SelectionConstants.div.style(this.state.centerDivPosition)} />
        )}
        {this.state.bottomDivPosition && (
          <div style={SelectionConstants.div.style(this.state.bottomDivPosition)} />
        )}
      </span>
    );
  }
}
