import * as React from "react";

import { Props, State } from "./types";
import { CursorConstants, defaultSuggestionListDecoration } from "./constants";
import { cursorPropsToState, handleOnEditorScroll } from "./utils";
import "../style.css";

import { getRoot } from "../Editor/utils";

export class Cursor extends React.Component<Props, State> {
  static readonly defaultProps: Required<Pick<Props, "suggestionListDecoration">> = {
    suggestionListDecoration: defaultSuggestionListDecoration,
  };
  private root: HTMLSpanElement | null;
  private handleOnEditorScroll?: () => void;

  constructor(props: Props) {
    super(props);
    this.state = { position: { top: 0, left: 0 }, cursorSize: 0 };
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
    return (
      <span ref={(root) => (this.root = root)}>
        <this.CursorBar />
        <this.HiddenTextArea />
        <this.SuggestionList />
      </span>
    );
  }

  private CursorBar = (): React.ReactElement => {
    const { position, cursorSize } = this.state;
    return (
      <div
        className={CursorConstants.rootDiv.className}
        style={CursorConstants.rootDiv.style(position, cursorSize)}
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
    );
  };

  private HiddenTextArea = (): React.ReactElement => {
    const constants = CursorConstants.textArea;
    const { position, cursorSize } = this.state;
    const textLength = this.props.textAreaValue.length;
    return (
      <textarea
        className={constants.className}
        value={this.props.textAreaValue}
        wrap={constants.wrap}
        spellCheck={constants.spellCheck}
        autoCapitalize={constants.autoCapitalize}
        onKeyDown={(event) => this.props.onKeyDown(event)}
        onChange={(event) => this.props.onTextChange(event)}
        onCut={(event) => this.props.onTextCut(event)}
        onCopy={(event) => this.props.onTextCopy(event)}
        onPaste={(event) => this.props.onTextPaste(event)}
        onCompositionStart={(event) => this.props.onTextCompositionStart(event)}
        onCompositionEnd={(event) => this.props.onTextCompositionEnd(event)}
        style={constants.style(position, cursorSize, textLength)}
      />
    );
  };

  private SuggestionList = (): React.ReactElement => {
    const constants = CursorConstants.suggestion;
    const { position, cursorSize } = this.state;
    const { width, maxHeight, fontSize } = this.props.suggestionListDecoration;
    const hidden = this.props.suggestions.length == 0;
    return (
      <ul
        className={constants.list.className}
        style={constants.list.style(position, cursorSize, width, maxHeight, hidden)}
      >
        {this.props.suggestions.map((suggestion: string, index: number) => (
          <li
            key={index}
            aria-selected={this.props.suggestionIndex == index}
            className={constants.item.className(index)}
            onMouseDown={(event) => this.props.onSuggectionMouseDown(event)}
            style={constants.item.style(fontSize)}
          >
            {suggestion}
          </li>
        ))}
      </ul>
    );
  };
}
