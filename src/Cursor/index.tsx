import * as React from "react";

import { Props, State } from "./types";
import { CursorConstants } from "./constants";
import { cursorPropsToState, handleOnEditorScroll } from "./utils";
import "../style.css";

import { getRoot } from "../Editor/utils";

export class Cursor extends React.Component<Props, State> {
  private root: HTMLSpanElement | null;
  private textArea: HTMLTextAreaElement | null;
  private handleOnEditorScroll?: () => void;

  constructor(props: Props) {
    super(props);
    this.state = { position: [0, 0], cursorSize: 0 };
    this.root = null;
    this.textArea = null;
  }

  componentDidUpdate(prevProps: Readonly<Props>): void {
    if (!this.root || prevProps == this.props) return;
    if (this.props.coordinate) this.textArea?.focus();

    const state = cursorPropsToState(this.props, this.state, this.root);
    if (state != this.state) this.setState(state);

    const editorRoot = getRoot(this.root);
    if (!editorRoot) return;
    if (this.handleOnEditorScroll) {
      editorRoot.removeEventListener("scroll", this.handleOnEditorScroll);
    }
    this.handleOnEditorScroll = () => {
      if (!this.root) return;
      const state = handleOnEditorScroll(this.props, this.state, this.root);
      if (state != this.state) this.setState(state);
    };
    editorRoot.addEventListener("scroll", this.handleOnEditorScroll);
  }

  render(): React.ReactElement {
    const [top, left] = this.state.position;
    const { cursorSize } = this.state;
    const textLength = this.props.textAreaValue.length;
    return (
      <span ref={(root) => (this.root = root)}>
        <div
          className={CursorConstants.rootDiv.className}
          style={CursorConstants.rootDiv.style(top, left, cursorSize)}
        >
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
          className={CursorConstants.textArea.className}
          value={this.props.textAreaValue}
          wrap={CursorConstants.textArea.wrap}
          spellCheck={CursorConstants.textArea.spellCheck}
          autoCapitalize={CursorConstants.textArea.autoCapitalize}
          onKeyDown={(event) => {
            event.preventDefault();
            this.props.onKeyDown(event.key);
          }}
          onChange={(event) => this.props.onTextChange(event.target.value)}
          onCompositionStart={() => this.props.onTextCompositionStart()}
          onCompositionEnd={() => this.props.onTextCompositionEnd()}
          style={CursorConstants.textArea.style(top, left, cursorSize, textLength)}
          ref={(textArea) => (this.textArea = textArea)}
        />
      </span>
    );
  }
}
