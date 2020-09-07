import * as React from "react";

import { Props, State, TaggedLink, SelectionWithMouse } from "./types";
import { EditorConstants } from "./constants";
import {
  handleOnMouseDown,
  handleOnMouseMove,
  handleOnMouseUp,
  handleOnMouseLeave,
  handleOnKeyDown,
  handleOnChange,
  handleOnCompositionStart,
} from "./utils";
import "../style.css";

import { Cursor } from "../Cursor";
import { Selection } from "../Selection";
import { TextLines } from "../TextLines";
import { DecorationSetting } from "../TextLines/types";

type AnnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;

export class Editor extends React.Component<Props, State> {
  static readonly defaultProps: Required<
    Pick<Props, "decoration" | "bracketLinkProps" | "hashTagProps" | "taggedLinkMap">
  > = {
    decoration: {
      fontSizes: { level1: 16, level2: 20, level3: 24 },
    },
    bracketLinkProps: () => ({}),
    hashTagProps: () => ({}),
    taggedLinkMap: {},
  };
  private root: HTMLDivElement | null;

  constructor(props: Props) {
    super(props);
    this.state = {
      cursorCoordinate: undefined,
      textAreaValue: "",
      isComposing: false,
      textSelection: undefined,
      selectionWithMouse: SelectionWithMouse.Inactive,
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
          >
            <Cursor
              coordinate={this.state.cursorCoordinate}
              textAreaValue={this.state.textAreaValue}
              isComposing={this.state.isComposing}
              onKeyDown={(key) => {
                if (this.props.disabled) return;
                const [text, state] = handleOnKeyDown(this.props.text, this.state, key);
                if (state != this.state) this.setState(state);
                if (text != this.props.text) this.props.onChangeText(text);
              }}
              onTextChange={(value) => {
                if (this.props.disabled) return;
                const [text, state] = handleOnChange(this.props.text, this.state, value);
                if (state != this.state) this.setState(state);
                if (text != this.props.text) this.props.onChangeText(text);
              }}
              onTextCompositionStart={() => {
                if (this.props.disabled) return;
                const [text, state] = handleOnCompositionStart(this.props.text, this.state);
                if (state != this.state) this.setState(state);
                if (text != this.props.text) this.props.onChangeText(text);
              }}
            />
            <Selection selection={this.state.textSelection} />
            <TextLines
              text={this.props.text}
              decoration={this.props.decoration as DecorationSetting}
              bracketLinkProps={this.props.bracketLinkProps as (linkName: string) => AnnchorProps}
              bracketLinkDisabled={this.props.bracketLinkDisabled}
              hashTagProps={this.props.hashTagProps as (hashTagName: string) => AnnchorProps}
              hashTagDisabled={this.props.hashTagDisabled}
              taggedLinkMap={this.props.taggedLinkMap as { [tag: string]: TaggedLink }}
              cursorCoordinate={this.state.cursorCoordinate}
            />
          </div>
        </div>
      </div>
    );
  }

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
