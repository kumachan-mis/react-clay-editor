import * as React from "react";

import { Props, State } from "./types";
import { CursorConstants } from "./constants";
import { cursorPropsToState, handleOnEditorScroll, cursorIn } from "./utils";

import { getTextLinesRoot } from "../TextLines/utils";

export class Cursor extends React.Component<Props, State> {
  private root: HTMLSpanElement | null;
  private textArea: HTMLTextAreaElement | null;
  private handleOnEditorScroll?: () => void;

  constructor(props: Props) {
    super(props);
    this.state = { position: [0, 0], textAreaValue: "", cursorSize: 0 };
    this.root = null;
    this.textArea = null;
  }

  componentDidUpdate(prevProps: Readonly<Props>): void {
    if (!this.root || prevProps == this.props) return;
    const state = cursorPropsToState(this.props, this.state, this.root);
    if (state != this.state) this.setState(state);
    if (this.props.coordinate) this.textArea?.focus();
    const textLinesRoot = getTextLinesRoot(this.root);
    if (textLinesRoot) {
      if (this.handleOnEditorScroll) {
        textLinesRoot.removeEventListener("scroll", this.handleOnEditorScroll);
      }
      this.handleOnEditorScroll = () => {
        if (!this.root) return;
        const state = handleOnEditorScroll(this.props, this.state, this.root);
        if (state != this.state) this.setState(state);
      };
      textLinesRoot.addEventListener("scroll", this.handleOnEditorScroll);
    }
  }

  render(): JSX.Element {
    const [top, left] = this.state.position;
    const { cursorSize } = this.state;
    const hidden = !this.root || !cursorIn([top, left], cursorSize, this.root);
    const textLength = this.state.textAreaValue.length;
    return (
      <span ref={(root) => (this.root = root)}>
        <div style={CursorConstants.rootDiv.style(top, left, cursorSize, hidden)}>
          <svg width={CursorConstants.svg.width} height={cursorSize}>
            <rect
              x={CursorConstants.rect.x}
              y={CursorConstants.rect.y}
              width={CursorConstants.rect.width}
              height={CursorConstants.rect.height}
            />
          </svg>
        </div>
        <textarea
          value={this.state.textAreaValue}
          wrap={CursorConstants.textArea.wrap}
          spellCheck={CursorConstants.textArea.spellCheck}
          autoCapitalize={CursorConstants.textArea.autoCapitalize}
          onChange={(event) => this.setState({ textAreaValue: event.target.value })}
          onCompositionStart={() => this.props.onTextCompositionStart()}
          onCompositionEnd={() => {
            this.props.onTextCompositionEnd(this.state.textAreaValue);
            this.setState({ textAreaValue: "" });
          }}
          style={CursorConstants.textArea.style(top, left, cursorSize, textLength)}
          ref={(textArea) => (this.textArea = textArea)}
        />
      </span>
    );
  }
}
