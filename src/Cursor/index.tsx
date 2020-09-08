import * as React from "react";

import { Props, State } from "./types";
import { CursorConstants } from "./constants";
import { cursorPropsToState, handleOnEditorScroll } from "./utils";
import "../style.css";

import { getRoot } from "../Editor/utils";

export class Cursor extends React.Component<Props, State> {
  private root: HTMLSpanElement | null;
  private handleOnEditorScroll?: () => void;

  constructor(props: Props) {
    super(props);
    this.state = { position: [0, 0], cursorSize: 0 };
    this.root = null;
  }

  componentDidUpdate(prevProps: Readonly<Props>): void {
    if (!this.root || prevProps == this.props) return;

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
          defaultValue={this.props.textAreaValue}
          wrap={CursorConstants.textArea.wrap}
          spellCheck={CursorConstants.textArea.spellCheck}
          autoCapitalize={CursorConstants.textArea.autoCapitalize}
          onKeyDown={(event) => this.props.onKeyDown(event)}
          onChange={(event) => this.props.onTextChange(event)}
          onCompositionStart={() => this.props.onTextCompositionStart()}
          onCompositionEnd={(event) => this.props.onTextCompositionEnd(event)}
          style={CursorConstants.textArea.style(top, left, cursorSize, textLength)}
        />
      </span>
    );
  }
}
