import React from 'react';

import { EditorProps, useEditorPropsValueContext } from '../../../contexts/EditorPropsContext';
import {
  EditorState,
  useEditorStateContext,
  useEditorStateValueContext,
  useSetEditorStateContext,
} from '../../../contexts/EditorStateContext';
import { useEditorTextContext, useEditorTextValueContext } from '../../../contexts/EditorTextContext';
import { useEditorTextNodesValueContext } from '../../../contexts/EditorTextNodesContext';
import { CursorProps } from '../../molecules/cursor/Cursor';
import { SelectionProps } from '../../molecules/selection/Selection';
import { TextProps } from '../../molecules/text/Text/types';

import {
  handleOnKeyDown,
  handleOnTextChange,
  handleOnTextCompositionStart,
  handleOnTextCompositionEnd,
  handleOnTextCut,
  handleOnTextCopy,
  handleOnTextPaste,
  handleOnSuggestionMouseDown,
  handleOnClick,
  handleOnMouseDown,
} from './callbacks';

export function useTextFieldBody(): {
  ref: React.RefObject<HTMLDivElement>;
  onMouseDown: React.MouseEventHandler<HTMLDivElement>;
  onClick: React.MouseEventHandler<HTMLDivElement>;
} {
  const text = useEditorTextValueContext();
  const setState = useSetEditorStateContext();
  const ref = React.useRef<HTMLDivElement>(null);

  const onMouseDown = React.useCallback(
    (event: React.MouseEvent) => {
      if (event.button !== 0) return;
      setState((state) => handleOnMouseDown(text, state, event, ref.current));
    },
    [setState, text, ref]
  );

  const onClick = React.useCallback(
    (event: React.MouseEvent) => {
      if (event.button !== 0) return;
      setState((state) => handleOnClick(text, state, event, ref.current));
    },
    [setState, text, ref]
  );

  return { ref, onMouseDown, onClick };
}

export function useSelection(): SelectionProps {
  const { cursorSelection } = useEditorStateValueContext();
  return { cursorSelection };
}

export function useCursor(): CursorProps {
  const [text, setText] = useEditorTextContext();
  const [state, setState] = useEditorStateContext();
  const props = useEditorPropsValueContext();

  const createEventHandler = React.useCallback(
    <Event>(
      handler: (text: string, state: EditorState, event: Event) => [string, EditorState]
    ): ((event: Event) => void) => {
      return (event) => {
        const [newText, newState] = handler(text, state, event);
        setState(newState);
        setText(newText);
      };
    },
    [text, state, setState, setText]
  );

  const createEventHandlerWithProps = React.useCallback(
    <Event>(
      handler: (text: string, props: EditorProps, state: EditorState, event: Event) => [string, EditorState]
    ): ((event: Event) => void) => {
      return (event) => {
        const [newText, newState] = handler(text, props, state, event);
        setState(newState);
        setText(newText);
      };
    },
    [text, props, state, setState, setText]
  );

  return {
    cursorCoordinate: state.cursorCoordinate,
    textAreaValue: state.textAreaValue,
    suggestionType: state.suggestionType,
    suggestions: state.suggestions,
    suggestionIndex: state.suggestionIndex,
    cursorScroll: state.cursorScroll,
    onKeyDown: createEventHandlerWithProps(handleOnKeyDown),
    onTextChange: createEventHandlerWithProps(handleOnTextChange),
    onTextCompositionStart: createEventHandler(handleOnTextCompositionStart),
    onTextCompositionEnd: createEventHandlerWithProps(handleOnTextCompositionEnd),
    onTextCut: createEventHandler(handleOnTextCut),
    onTextCopy: createEventHandler(handleOnTextCopy),
    onTextPaste: createEventHandler(handleOnTextPaste),
    onSuggestionMouseDown: createEventHandler(handleOnSuggestionMouseDown),
  };
}

export function useText(): TextProps {
  const nodes = useEditorTextNodesValueContext();
  const { cursorCoordinate, cursorSelection } = useEditorStateValueContext();
  const props = useEditorPropsValueContext();

  return {
    nodes,
    cursorCoordinate,
    cursorSelection,
    textVisual: props.textProps,
    bracketLinkVisual: props.bracketLinkProps,
    hashtagVisual: props.hashtagProps,
    codeVisual: props.codeProps,
    formulaVisual: props.formulaProps,
    taggedLinkVisualMap: props.taggedLinkPropsMap,
  };
}
