import React from 'react';

import { Cursor } from '../Cursor';
import { Selection } from '../Selection';
import { TextLines } from '../TextLines';
import { mergeClassNames, createTestId } from '../common/utils';

import {
  handleOnMouseDown,
  handleOnMouseMove,
  handleOnMouseUp,
  handleOnClick,
  handleOnMouseScrollUp,
  handleOnMouseScrollDown,
  handleOnKeyDown,
  handleOnTextChange,
  handleOnTextCut,
  handleOnTextCopy,
  handleOnTextPaste,
  handleOnTextCompositionStart,
  handleOnTextCompositionEnd,
  handleOnSuggectionMouseDown,
} from './callbacks';
import { EditorConstants } from './constants';
import { Props, State } from './types';

export const Editor: React.FC<Props> = (props) => {
  const [state, setState] = React.useState<State>({
    cursorCoordinate: undefined,
    textAreaValue: '',
    isComposing: false,
    textSelection: undefined,
    selectionMouse: 'deactive',
    historyHead: -1,
    editActionHistory: [],
    suggestionType: 'none',
    suggestions: [],
    suggestionIndex: -1,
    suggestionStart: 0,
  });
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const timeIdRef = React.useRef<number>(0);

  React.useEffect(() => {
    switch (state.selectionMouse) {
      case 'active-up':
        if (props.readonly || timeIdRef.current) break;
        timeIdRef.current = window.setInterval(() => {
          setState((state) => handleOnMouseScrollUp(props.text, state));
        });
        break;
      case 'active-down':
        if (props.readonly || timeIdRef.current) break;
        timeIdRef.current = window.setInterval(() => {
          setState((state) => handleOnMouseScrollDown(props.text, state));
        });
        break;
      default:
        if (timeIdRef.current) window.clearInterval(timeIdRef.current);
        timeIdRef.current = 0;
        break;
    }

    return () => {
      if (timeIdRef.current) window.clearInterval(timeIdRef.current);
      timeIdRef.current = 0;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.selectionMouse]);

  const createMouseEventHandler = React.useCallback(
    <Event extends MouseEvent | React.MouseEvent>(
      handler: (text: string, state: State, event: Event, root: HTMLElement | null) => [string, State]
    ): ((event: Event) => void) => {
      return (event) => {
        if (props.readonly || event.button !== 0) return;
        const [newText, newState] = handler(props.text, state, event, rootRef.current);
        if (newState !== state) setState(newState);
        if (newText !== props.text) props.onChangeText(newText);
      };
    },
    [state, props, setState, rootRef]
  );

  const createKeyboardEventHandler = React.useCallback(
    <Event,>(handler: (text: string, state: State, event: Event) => [string, State]): ((event: Event) => void) => {
      return (event) => {
        if (props.readonly) return;
        const [newText, newState] = handler(props.text, state, event);
        if (newState !== state) setState(newState);
        if (newText !== props.text) props.onChangeText(newText);
      };
    },
    [state, props, setState]
  );

  const createKeyboardEventHandlerWithProps = React.useCallback(
    <Event,>(
      handler: (text: string, props: Props, state: State, event: Event) => [string, State]
    ): ((event: Event) => void) => {
      return (event) => {
        if (props.readonly) return;
        const [newText, newState] = handler(props.text, props, state, event);
        if (newState !== state) setState(newState);
        if (newText !== props.text) props.onChangeText(newText);
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
      if (props.readonly || rootRef.current?.contains(event.target as Node)) return;
      setState({
        ...state,
        cursorCoordinate: undefined,
        textAreaValue: '',
        isComposing: false,
        textSelection: undefined,
        selectionMouse: 'deactive',
        suggestionType: 'none',
        suggestions: [],
        suggestionIndex: -1,
      });
    },
    [props.readonly, state, setState]
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
    <div className={mergeClassNames(EditorConstants.editor.className, props.className)} style={props.style}>
      <div
        className={EditorConstants.root.className}
        ref={rootRef}
        data-selectid={EditorConstants.root.selectId}
        data-testid={createTestId(EditorConstants.root.testId)}
      >
        <div
          className={EditorConstants.body.className}
          onMouseDown={_handleOnMouseDown}
          onClick={createMouseEventHandler(handleOnClick)}
          data-selectid={EditorConstants.body.selectId}
          data-testid={createTestId(EditorConstants.body.testId)}
        >
          <Cursor
            coordinate={state.cursorCoordinate}
            textAreaValue={state.textAreaValue}
            suggestionType={state.suggestionType}
            suggestions={state.suggestions}
            suggestionIndex={state.suggestionIndex}
            mouseHold={state.selectionMouse}
            onKeyDown={createKeyboardEventHandlerWithProps(handleOnKeyDown)}
            onTextChange={createKeyboardEventHandlerWithProps(handleOnTextChange)}
            onTextCompositionStart={createKeyboardEventHandler(handleOnTextCompositionStart)}
            onTextCompositionEnd={createKeyboardEventHandlerWithProps(handleOnTextCompositionEnd)}
            onTextCut={createKeyboardEventHandler(handleOnTextCut)}
            onTextCopy={createKeyboardEventHandler(handleOnTextCopy)}
            onTextPaste={createKeyboardEventHandler(handleOnTextPaste)}
            onSuggectionMouseDown={createKeyboardEventHandler(handleOnSuggectionMouseDown)}
          />
          <Selection textSelection={state.textSelection} />
          <TextLines
            text={props.text}
            syntax={props.syntax}
            cursorCoordinate={state.cursorCoordinate}
            bracketLinkProps={props.bracketLinkProps}
            hashtagProps={props.hashtagProps}
            codeProps={props.codeProps}
            formulaProps={props.formulaProps}
            taggedLinkPropsMap={props.taggedLinkPropsMap}
          />
        </div>
      </div>
    </div>
  );
};
