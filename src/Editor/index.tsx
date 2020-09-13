import * as React from "react";

import { Props, State } from "./types";
import { EditorConstants } from "./constants";
import {
  handleOnMouseDown,
  handleOnMouseMove,
  handleOnMouseUp,
  handleOnMouseLeave,
  handleOnKeyDown,
  handleOnTextChange,
  handleOnTextCut,
  handleOnTextCopy,
  handleOnTextPaste,
  handleOnTextCompositionStart,
  handleOnTextCompositionEnd,
  handleOnSuggectionMouseDown,
} from "./utils";
import "../style.css";

import { Cursor } from "../Cursor";
import { Selection } from "../Selection";
import { TextLines } from "../TextLines";
import { SuggestionType } from "../Cursor/types";
import { SelectionWithMouse } from "../Selection/types";

export class Editor extends React.Component<Props, State> {
  private root: HTMLDivElement | null;

  constructor(props: Props) {
    super(props);
    this.state = {
      cursorCoordinate: undefined,
      textAreaValue: "",
      isComposing: false,
      suggestionType: SuggestionType.None,
      suggestions: [],
      suggectionIndex: -1,
      textSelection: undefined,
      selectionWithMouse: SelectionWithMouse.Inactive,
      historyHead: -1,
      editActionHistory: [],
    };

    this.root = null;
  }

  componentDidMount(): void {
    document.addEventListener("mousedown", this.handleOnEditorBlur);
  }

  componentWillUnmount(): void {
    document.removeEventListener("mousedown", this.handleOnEditorBlur);
  }

  render(): React.ReactElement {
    return (
      <div style={this.props.style}>
        <div className={EditorConstants.root.className} ref={(root) => (this.root = root)}>
          <div
            className={EditorConstants.editor.className}
            onMouseDown={this.createMouseEventHandler(handleOnMouseDown)}
            onMouseMove={this.createMouseEventHandler(handleOnMouseMove)}
            onMouseUp={this.createMouseEventHandler(handleOnMouseUp)}
            onMouseLeave={this.createMouseEventHandler(handleOnMouseLeave)}
          >
            <Cursor
              coordinate={this.state.cursorCoordinate}
              textAreaValue={this.state.textAreaValue}
              suggestionType={this.state.suggestionType}
              suggestions={this.state.suggestions}
              suggestionIndex={this.state.suggectionIndex}
              onKeyDown={this.createCursorEventHandler(handleOnKeyDown)}
              onTextChange={this.createCursorEventHandler(handleOnTextChange)}
              onTextCompositionStart={this.createCursorEventHandler(handleOnTextCompositionStart)}
              onTextCompositionEnd={this.createCursorEventHandler(handleOnTextCompositionEnd)}
              onTextCut={this.createCursorEventHandler(handleOnTextCut)}
              onTextCopy={this.createCursorEventHandler(handleOnTextCopy)}
              onTextPaste={this.createCursorEventHandler(handleOnTextPaste)}
              onSuggectionMouseDown={this.createCursorEventHandler(handleOnSuggectionMouseDown)}
            />
            <Selection textSelection={this.state.textSelection} />
            <TextLines
              text={this.props.text}
              decoration={this.props.decoration}
              bracketLinkProps={this.props.bracketLinkProps}
              hashTagProps={this.props.hashTagProps}
              taggedLinkPropsMap={this.props.taggedLinkPropsMap}
              cursorCoordinate={this.state.cursorCoordinate}
            />
          </div>
        </div>
      </div>
    );
  }

  private createMouseEventHandler = (
    handler: (
      text: string,
      state: State,
      pos: [number, number],
      root: HTMLElement | null
    ) => [string, State]
  ): ((event: React.MouseEvent) => void) => {
    return (event) => {
      if (this.props.disabled || event.button != 0) return;
      const position: [number, number] = [event.clientX, event.clientY];
      const [text, state] = handler(this.props.text, this.state, position, this.root);
      if (state != this.state) this.setState(state);
      if (text != this.props.text) this.props.onChangeText(text);
    };
  };

  private createCursorEventHandler = <Event,>(
    handler: (text: string, state: State, event: Event) => [string, State]
  ): ((event: Event) => void) => {
    return (event) => {
      if (this.props.disabled) return;
      const [text, state] = handler(this.props.text, this.state, event);
      if (state != this.state) this.setState(state);
      if (text != this.props.text) this.props.onChangeText(text);
    };
  };

  private handleOnEditorBlur = (event: MouseEvent) => {
    if (
      !this.props.disabled &&
      this.state.cursorCoordinate &&
      this.root &&
      !this.root.contains(event.target as Node)
    ) {
      this.setState({ cursorCoordinate: undefined });
    }
  };
}
