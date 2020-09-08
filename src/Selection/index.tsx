import * as React from "react";

import { Props, State } from "./types";
import { SelectionConstants } from "./constants";
import { selectionPropsToState, getSelectedText } from "./utils";
import "../style.css";

export class Selection extends React.Component<Props, State> {
  private root: HTMLSpanElement | null;

  constructor(props: Props) {
    super(props);
    this.state = {
      topDivPosition: undefined,
      centerDivPosition: undefined,
      bottomDivPosition: undefined,
      textAreaPosition: undefined,
    };
    this.root = null;
  }

  componentDidUpdate(prevProps: Readonly<Props>): void {
    if (!this.root || prevProps == this.props) return;
    const state = selectionPropsToState(this.props, this.root);
    if (this.state != state) this.setState(state);
  }

  render(): React.ReactElement {
    const textAreaValue = getSelectedText(this.props);

    return (
      <span ref={(root) => (this.root = root)}>
        {this.state.topDivPosition && (
          <div
            className={SelectionConstants.div.className}
            style={SelectionConstants.div.style(this.state.topDivPosition)}
          />
        )}
        {this.state.centerDivPosition && (
          <div
            className={SelectionConstants.div.className}
            style={SelectionConstants.div.style(this.state.centerDivPosition)}
          />
        )}
        {this.state.bottomDivPosition && (
          <div
            className={SelectionConstants.div.className}
            style={SelectionConstants.div.style(this.state.bottomDivPosition)}
          />
        )}
        {this.state.textAreaPosition && (
          <textarea
            className={SelectionConstants.textArea.className}
            value={textAreaValue}
            wrap={SelectionConstants.textArea.wrap}
            spellCheck={SelectionConstants.textArea.spellCheck}
            autoCapitalize={SelectionConstants.textArea.autoCapitalize}
            style={SelectionConstants.textArea.style(this.state.textAreaPosition)}
          />
        )}
      </span>
    );
  }
}
