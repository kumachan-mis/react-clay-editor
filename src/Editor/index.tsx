import * as React from "react";

import { Props, State } from "./types";
import { EditorConstants } from "./constants";
import {
  handleOnMouseDown,
  handleOnMouseMove,
  handleOnMouseUp,
  handleOnMouseLeave,
  handleOnKeyDown,
  handleOnCompositionStart,
  handleOnCompositionEnd,
} from "./utils";
import { Cursor } from "../Cursor";
import { Selection } from "../Selection";
import { TextLines } from "../TextLines";
import { TextStyle } from "../TextLines/types";

export class Editor extends React.Component<Props, State> {
  static readonly defaultProps: Required<Pick<Props, "textStyle">> = {
    textStyle: {
      fontSizes: { level1: 16, level2: 20, level3: 24 },
    },
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      cursorCoordinate: undefined,
      isComposing: false,
      textSelection: undefined,
      moveCount: 0,
    };
  }

  componentDidMount(): void {
    document.addEventListener("mousedown", this.handleOnEditorBlur);
    document.addEventListener("keydown", this.handleOnKeyDown);
  }

  componentWillUnmount(): void {
    document.removeEventListener("keydown", this.handleOnKeyDown);
    document.removeEventListener("mousedown", this.handleOnEditorBlur);
  }

  render(): JSX.Element {
    return (
      <div
        id={EditorConstants.editor.id}
        onMouseDown={(event) => {
          if (this.props.disabled || event.button != 0) return;
          const { clientX: x, clientY: y } = event;
          const [text, state] = handleOnMouseDown(this.props.text, this.state, [x, y]);
          if (state != this.state) this.setState(state);
          if (text != this.props.text) this.props.onChangeText(text);
        }}
        onMouseMove={(event) => {
          if (this.props.disabled) return;
          const { clientX: x, clientY: y } = event;
          const [text, state] = handleOnMouseMove(this.props.text, this.state, [x, y]);
          if (state != this.state) this.setState(state);
          if (text != this.props.text) this.props.onChangeText(text);
        }}
        onMouseUp={(event) => {
          if (this.props.disabled || event.button != 0) return;
          const { clientX: x, clientY: y } = event;
          const [text, state] = handleOnMouseUp(this.props.text, this.state, [x, y]);
          if (state != this.state) this.setState(state);
          if (text != this.props.text) this.props.onChangeText(text);
        }}
        onMouseLeave={(event) => {
          if (this.props.disabled || event.button != 0) return;
          const { clientX: x, clientY: y } = event;
          const [text, state] = handleOnMouseLeave(this.props.text, this.state, [x, y]);
          if (state != this.state) this.setState(state);
          if (text != this.props.text) this.props.onChangeText(text);
        }}
        style={this.props.style}
      >
        <div style={EditorConstants.editor.style}>
          <Cursor
            coordinate={this.state.cursorCoordinate}
            onTextCompositionStart={() => {
              const [text, state] = handleOnCompositionStart(this.props.text, this.state);
              if (state != this.state) this.setState(state);
              if (text != this.props.text) this.props.onChangeText(text);
            }}
            onTextCompositionEnd={(dataText) => {
              const [text, state] = handleOnCompositionEnd(this.props.text, this.state, dataText);
              if (state != this.state) this.setState(state);
              if (text != this.props.text) this.props.onChangeText(text);
            }}
          />
          <Selection selection={this.state.textSelection} />
          <TextLines
            text={this.props.text}
            textStyle={this.props.textStyle as TextStyle}
            cursorCoordinate={this.state.cursorCoordinate}
          />
        </div>
      </div>
    );
  }

  private handleOnKeyDown = (event: KeyboardEvent) => {
    if (this.props.disabled || !this.state.cursorCoordinate) return;
    event.preventDefault();
    const [text, state] = handleOnKeyDown(this.props.text, this.state, event.key);
    if (state != this.state) this.setState(state);
    if (text != this.props.text) this.props.onChangeText(text);
  };

  private handleOnEditorBlur = (event: MouseEvent) => {
    if (this.props.disabled) return;
    const elements = document.elementsFromPoint(event.clientX, event.clientY);
    const editorId = EditorConstants.editor.id;
    const editor = elements.find((element) => element.id == editorId);
    if (!editor) this.setState({ cursorCoordinate: undefined });
  };
}
