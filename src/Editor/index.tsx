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
import { SelectionWithMouse } from "../Selection/types";
import { defaultTextDecoration } from "../TextLines/constants";
import { defaultSuggestionListDecoration } from "../Cursor/constants";

export const Editor: React.FC<Props> = (props) => {
  const [state, setState] = React.useState<State>({
    cursorCoordinate: undefined,
    textAreaValue: "",
    isComposing: false,
    textSelection: undefined,
    selectionWithMouse: SelectionWithMouse.Inactive,
    historyHead: -1,
    editActionHistory: [],
    ...EditorConstants.defaultSuggestionState,
  });
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  function createMouseEventHandlerWithProps(
    handler: (
      text: string,
      props: Props,
      state: State,
      position: [number, number],
      root: HTMLElement | null
    ) => [string, State]
  ): (event: React.MouseEvent) => void {
    return (event) => {
      if (props.disabled || event.button != 0) return;
      const position: [number, number] = [event.clientX, event.clientY];
      const [newText, newState] = handler(props.text, props, state, position, rootRef.current);
      if (newState != state) setState(newState);
      if (newText != props.text) props.onChangeText(newText);
    };
  }

  const createMouseEventHandler = (
    handler: (
      text: string,
      state: State,
      position: [number, number],
      root: HTMLElement | null
    ) => [string, State]
  ): ((event: React.MouseEvent) => void) => {
    return (event) => {
      if (props.disabled || event.button != 0) return;
      const position: [number, number] = [event.clientX, event.clientY];
      const [newText, newState] = handler(props.text, state, position, rootRef.current);
      if (newState != state) setState(newState);
      if (newText != props.text) props.onChangeText(newText);
    };
  };

  const createCursorEventHandler = <Event,>(
    handler: (text: string, state: State, event: Event) => [string, State]
  ): ((event: Event) => void) => {
    return (event) => {
      if (props.disabled) return;
      const [newText, newState] = handler(props.text, state, event);
      if (newState != state) setState(newState);
      if (newText != props.text) props.onChangeText(newText);
    };
  };

  const createCursorEventHandlerWithProps = <Event,>(
    handler: (text: string, props: Props, state: State, event: Event) => [string, State]
  ): ((event: Event) => void) => {
    return (event) => {
      if (props.disabled) return;
      const [newText, newState] = handler(props.text, props, state, event);
      if (newState != state) setState(newState);
      if (newText != props.text) props.onChangeText(newText);
    };
  };

  const handleOnEditorBlur = (event: MouseEvent) => {
    if (
      !props.disabled &&
      state.cursorCoordinate &&
      rootRef.current &&
      !rootRef.current.contains(event.target as Node)
    ) {
      setState({
        ...state,
        cursorCoordinate: undefined,
        textAreaValue: "",
        isComposing: false,
        textSelection: undefined,
        selectionWithMouse: SelectionWithMouse.Inactive,
        ...EditorConstants.defaultSuggestionState,
      });
    }
  };

  React.useEffect(() => {
    document.addEventListener("mousedown", handleOnEditorBlur);
    return () => document.removeEventListener("mousedown", handleOnEditorBlur);
  }, []);

  return (
    <div style={props.style}>
      <div className={EditorConstants.root.className} ref={rootRef}>
        <div
          className={EditorConstants.editor.className}
          onMouseDown={createMouseEventHandlerWithProps(handleOnMouseDown)}
          onMouseMove={createMouseEventHandler(handleOnMouseMove)}
          onMouseUp={createMouseEventHandler(handleOnMouseUp)}
          onMouseLeave={createMouseEventHandler(handleOnMouseLeave)}
        >
          <Cursor
            coordinate={state.cursorCoordinate}
            textAreaValue={state.textAreaValue}
            suggestionType={state.suggestionType}
            suggestions={state.suggestions}
            suggestionIndex={state.suggestionIndex}
            suggestionListDecoration={
              props.decoration?.suggestionList ?? defaultSuggestionListDecoration
            }
            onKeyDown={createCursorEventHandlerWithProps(handleOnKeyDown)}
            onTextChange={createCursorEventHandlerWithProps(handleOnTextChange)}
            onTextCompositionStart={createCursorEventHandler(handleOnTextCompositionStart)}
            onTextCompositionEnd={createCursorEventHandler(handleOnTextCompositionEnd)}
            onTextCut={createCursorEventHandler(handleOnTextCut)}
            onTextCopy={createCursorEventHandler(handleOnTextCopy)}
            onTextPaste={createCursorEventHandler(handleOnTextPaste)}
            onSuggectionMouseDown={createCursorEventHandler(handleOnSuggectionMouseDown)}
          />
          <Selection textSelection={state.textSelection} />
          <TextLines
            text={props.text}
            textDecoration={props.decoration?.text ?? defaultTextDecoration}
            bracketLinkProps={props.bracketLinkProps ?? {}}
            hashTagProps={props.hashTagProps ?? {}}
            taggedLinkPropsMap={props.taggedLinkPropsMap ?? {}}
            formulaProps={props.formulaProps ?? {}}
            cursorCoordinate={state.cursorCoordinate}
          />
        </div>
      </div>
    </div>
  );
};
