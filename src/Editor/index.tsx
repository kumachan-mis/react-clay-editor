import * as React from 'react';

import { Props, State } from './types';
import { EditorConstants } from './constants';
import {
  handleOnMouseDown,
  handleOnMouseMove,
  handleOnMouseUp,
  handleOnClick,
  handleOnKeyDown,
  handleOnTextChange,
  handleOnTextCut,
  handleOnTextCopy,
  handleOnTextPaste,
  handleOnTextCompositionStart,
  handleOnTextCompositionEnd,
  handleOnSuggectionMouseDown,
} from './callbacks';

import { Cursor } from '../Cursor';
import { Selection } from '../Selection';
import { TextLines } from '../TextLines';

export const Editor: React.FC<Props> = (props) => {
  const [state, setState] = React.useState<State>({
    cursorCoordinate: undefined,
    textAreaValue: '',
    isComposing: false,
    textSelection: undefined,
    selectionWithMouse: 'inactive',
    historyHead: -1,
    editActionHistory: [],
    suggestionType: 'none',
    suggestions: [],
    suggestionIndex: -1,
  });
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  const createMouseEventHandler = React.useCallback(
    <Event extends MouseEvent | React.MouseEvent>(
      handler: (text: string, state: State, event: Event, root: HTMLElement | null) => [string, State]
    ): ((event: Event) => void) => {
      return (event) => {
        if (props.readonly || event.button != 0) return;
        const [newText, newState] = handler(props.text, state, event, rootRef.current);
        if (newState != state) setState(newState);
        if (newText != props.text) props.onChangeText(newText);
      };
    },
    [state, props, setState, rootRef]
  );

  const createCursorEventHandler = React.useCallback(
    <Event,>(handler: (text: string, state: State, event: Event) => [string, State]): ((event: Event) => void) => {
      return (event) => {
        if (props.readonly) return;
        const [newText, newState] = handler(props.text, state, event);
        if (newState != state) setState(newState);
        if (newText != props.text) props.onChangeText(newText);
      };
    },
    [state, props, setState]
  );

  const createCursorEventHandlerWithProps = React.useCallback(
    <Event,>(
      handler: (text: string, props: Props, state: State, event: Event) => [string, State]
    ): ((event: Event) => void) => {
      return (event) => {
        if (props.readonly) return;
        const [newText, newState] = handler(props.text, props, state, event);
        if (newState != state) setState(newState);
        if (newText != props.text) props.onChangeText(newText);
      };
    },
    [state, props, setState]
  );

  const _handleOnMouseDown = React.useCallback(
    (event: React.MouseEvent) => createMouseEventHandler(handleOnMouseDown)(event),
    [createMouseEventHandler]
  );

  const _handleOnMouseMove = React.useCallback(
    (event: MouseEvent) => createMouseEventHandler(handleOnMouseMove)(event),
    [createMouseEventHandler]
  );

  const _handleOnMouseUp = React.useCallback(
    (event: MouseEvent) => createMouseEventHandler(handleOnMouseUp)(event),

    [createMouseEventHandler]
  );

  const handleOnEditorBlur = React.useCallback(
    (event: MouseEvent) => {
      if (
        !props.readonly &&
        state.cursorCoordinate &&
        rootRef.current &&
        !rootRef.current.contains(event.target as Node)
      ) {
        setState({
          ...state,
          cursorCoordinate: undefined,
          textAreaValue: '',
          isComposing: false,
          textSelection: undefined,
          selectionWithMouse: 'inactive',
          suggestionType: 'none',
          suggestions: [],
          suggestionIndex: -1,
        });
      }
    },
    [props.readonly, state, setState, rootRef]
  );

  React.useEffect(() => {
    document.addEventListener('mousemove', _handleOnMouseMove);
    return () => {
      document.removeEventListener('mousemove', _handleOnMouseMove);
    };
  }, [_handleOnMouseMove]);

  React.useEffect(() => {
    document.addEventListener('mouseup', _handleOnMouseUp);
    return () => {
      document.removeEventListener('mouseup', _handleOnMouseUp);
    };
  }, [_handleOnMouseUp]);

  React.useEffect(() => {
    document.addEventListener('mousedown', handleOnEditorBlur);
    return () => {
      document.removeEventListener('mousedown', handleOnEditorBlur);
    };
  }, [handleOnEditorBlur]);

  return (
    <div style={props.style}>
      <div className={EditorConstants.root.className} ref={rootRef}>
        <div
          className={EditorConstants.editor.className}
          onMouseDown={_handleOnMouseDown}
          onClick={createMouseEventHandler(handleOnClick)}
        >
          <Cursor
            coordinate={state.cursorCoordinate}
            textAreaValue={state.textAreaValue}
            suggestionType={state.suggestionType}
            suggestions={state.suggestions}
            suggestionIndex={state.suggestionIndex}
            suggestionListDecoration={props.decoration?.suggestionList}
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
            syntax={props.syntax}
            cursorCoordinate={state.cursorCoordinate}
            textDecoration={props.decoration?.text}
            bracketLinkProps={props.bracketLinkProps}
            hashTagProps={props.hashTagProps}
            codeProps={props.codeProps}
            formulaProps={props.formulaProps}
            taggedLinkPropsMap={props.taggedLinkPropsMap}
            readonly={props.readonly}
          />
        </div>
      </div>
    </div>
  );
};
