import { EditorProps, useEditorPropsValueContext } from '../../../contexts/EditorPropsContext';
import { EditorState, useEditorStateContext, useEditorStateValueContext } from '../../../contexts/EditorStateContext';
import { useTextContext } from '../../../contexts/TextContext';
import { useTextNodesValueContext } from '../../../contexts/TextNodesContext';
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
} from './callbacks';

import React from 'react';

export function useSelection(): SelectionProps {
  const { cursorSelection } = useEditorStateValueContext();
  return { cursorSelection };
}

export function useCursor(): CursorProps {
  const [text, setText] = useTextContext();
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
  const nodes = useTextNodesValueContext();
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
