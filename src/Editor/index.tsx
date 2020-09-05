import * as React from "react";

import { Props, State, SelectionWithMouse } from "./types";
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
import { DecorationSetting } from "../TextLines/types";

export class Editor extends React.Component<Props, State> {
  static readonly defaultProps: Required<Pick<Props, "declration">> = {
    declration: {
      fontSizes: { level1: 16, level2: 20, level3: 24 },
    },
  };
  private root: HTMLDivElement | null;

  constructor(props: Props) {
    super(props);
    this.state = {
      cursorCoordinate: undefined,
      isComposing: false,
      textSelection: undefined,
      selectionWithMouse: SelectionWithMouse.Inactive,
    };
    this.root = null;
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
      <div style={this.props.style}>
        <div
          className={EditorConstants.root.className}
          style={EditorConstants.root.style}
          ref={(root) => (this.root = root)}
        >
          <div
            className={EditorConstants.editor.className}
            onMouseDown={(event) => {
              if (this.props.disabled || event.button != 0) return;
              const pos: [number, number] = [event.clientX, event.clientY];
              const [text, state] = handleOnMouseDown(this.props.text, this.state, pos, this.root);
              if (state != this.state) this.setState(state);
              if (text != this.props.text) this.props.onChangeText(text);
            }}
            onMouseMove={(event) => {
              if (this.props.disabled) return;
              const pos: [number, number] = [event.clientX, event.clientY];
              const [text, state] = handleOnMouseMove(this.props.text, this.state, pos, this.root);
              if (state != this.state) this.setState(state);
              if (text != this.props.text) this.props.onChangeText(text);
            }}
            onMouseUp={(event) => {
              if (this.props.disabled || event.button != 0) return;
              const pos: [number, number] = [event.clientX, event.clientY];
              const [text, state] = handleOnMouseUp(this.props.text, this.state, pos, this.root);
              if (state != this.state) this.setState(state);
              if (text != this.props.text) this.props.onChangeText(text);
            }}
            onMouseLeave={(event) => {
              if (this.props.disabled || event.button != 0) return;
              const pos: [number, number] = [event.clientX, event.clientY];
              const [text, state] = handleOnMouseLeave(this.props.text, this.state, pos, this.root);
              if (state != this.state) this.setState(state);
              if (text != this.props.text) this.props.onChangeText(text);
            }}
            style={EditorConstants.editor.style}
          >
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
              decoration={this.props.declration as DecorationSetting}
              cursorCoordinate={this.state.cursorCoordinate}
            />
          </div>
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
    if (this.root && !elements.includes(this.root)) this.setState({ cursorCoordinate: undefined });
  };
}
