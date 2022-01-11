import React from 'react';

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

export function getRoot(element: HTMLElement): HTMLElement | null {
  return element.closest(`div[data-selectid="${EditorConstants.root.selectId}"]`);
}

export function getEditor(element: HTMLElement): HTMLElement | null {
  return element.closest(`div[data-selectid="${EditorConstants.editor.selectId}"]`);
}

export function getBody(element: HTMLElement): HTMLElement | null {
  return element.closest(`div[data-selectid="${EditorConstants.body.selectId}"]`);
}

export function useEditor(): [
  State,
  React.Dispatch<React.SetStateAction<State>>,
  React.MutableRefObject<HTMLDivElement | null>,
  React.MutableRefObject<HTMLDivElement | null>
] {
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
  const editorRef = React.useRef<HTMLDivElement | null>(null);

  return [state, setState, rootRef, editorRef];
}

export function useMouseEventHandlers(
  props: Props,
  state: State,
  setState: React.Dispatch<React.SetStateAction<State>>,
  rootRef: React.MutableRefObject<HTMLDivElement | null>,
  editorRef: React.MutableRefObject<HTMLDivElement | null>
): [
  {
    onMouseDown: (event: MouseEvent) => void;
    onMouseMove: (event: MouseEvent) => void;
    onMouseUp: (event: MouseEvent) => void;
  },
  {
    onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
    onMouseMove?: React.MouseEventHandler<HTMLDivElement>;
    onMouseUp?: React.MouseEventHandler<HTMLDivElement>;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
  },
  {
    onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
    onMouseMove?: React.MouseEventHandler<HTMLDivElement>;
    onMouseUp?: React.MouseEventHandler<HTMLDivElement>;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
  }
] {
  const createMouseEventHandler = React.useCallback(
    <Event extends MouseEvent | React.MouseEvent>(
      handler: (text: string, state: State, event: Event, root: HTMLElement | null) => [string, State]
    ): ((event: Event) => void) => {
      return (event) => {
        if (props.readonly || event.button !== 0) return;
        const [newText, newState] = handler(props.text, state, event, editorRef.current);
        if (newState !== state) setState(newState);
        if (newText !== props.text) props.onChangeText(newText);
      };
    },
    [props, state, editorRef, setState]
  );

  const handleOnDocMouseDown = React.useCallback(
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
    [props.readonly, state, rootRef, setState]
  );
  const handleOnDocMouseMove = React.useCallback(
    (event: MouseEvent) => createMouseEventHandler(handleOnMouseMove)(event),
    [createMouseEventHandler]
  );
  const handleOnDocMouseUp = React.useCallback(
    (event: MouseEvent) => createMouseEventHandler(handleOnMouseUp)(event),
    [createMouseEventHandler]
  );

  const handleOnRootMouseUp = React.useCallback(
    () => rootRef.current?.querySelector('textarea')?.focus({ preventScroll: true }),
    [rootRef]
  );

  const handleOnBodyMouseDown = React.useCallback(
    (event: React.MouseEvent) => createMouseEventHandler(handleOnMouseDown)(event),
    [createMouseEventHandler]
  );
  const handleOnBodyClick = React.useCallback(
    (event: React.MouseEvent) => createMouseEventHandler(handleOnClick)(event),
    [createMouseEventHandler]
  );

  return [
    { onMouseDown: handleOnDocMouseDown, onMouseMove: handleOnDocMouseMove, onMouseUp: handleOnDocMouseUp },
    { onMouseUp: handleOnRootMouseUp },
    { onMouseDown: handleOnBodyMouseDown, onClick: handleOnBodyClick },
  ];
}

export function useCursorEventHandlers(
  props: Props,
  state: State,
  setState: React.Dispatch<React.SetStateAction<State>>
): {
  onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onTextChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onTextCut: (event: React.ClipboardEvent<HTMLTextAreaElement>) => void;
  onTextCopy: (event: React.ClipboardEvent<HTMLTextAreaElement>) => void;
  onTextPaste: (event: React.ClipboardEvent<HTMLTextAreaElement>) => void;
  onTextCompositionStart: (event: React.CompositionEvent<HTMLTextAreaElement>) => void;
  onTextCompositionEnd: (event: React.CompositionEvent<HTMLTextAreaElement>) => void;
  onSuggectionMouseDown: (event: React.MouseEvent<HTMLLIElement>) => void;
} {
  const createCursorEventHandler = React.useCallback(
    <Event>(handler: (text: string, state: State, event: Event) => [string, State]): ((event: Event) => void) => {
      return (event) => {
        if (props.readonly) return;
        const [newText, newState] = handler(props.text, state, event);
        if (newState !== state) setState(newState);
        if (newText !== props.text) props.onChangeText(newText);
      };
    },
    [props, state, setState]
  );

  const createCursorEventHandlerWithProps = React.useCallback(
    <Event>(
      handler: (text: string, props: Props, state: State, event: Event) => [string, State]
    ): ((event: Event) => void) => {
      return (event) => {
        if (props.readonly) return;
        const [newText, newState] = handler(props.text, props, state, event);
        if (newState !== state) setState(newState);
        if (newText !== props.text) props.onChangeText(newText);
      };
    },
    [props, state, setState]
  );

  return {
    onKeyDown: createCursorEventHandlerWithProps(handleOnKeyDown),
    onTextChange: createCursorEventHandlerWithProps(handleOnTextChange),
    onTextCompositionStart: createCursorEventHandler(handleOnTextCompositionStart),
    onTextCompositionEnd: createCursorEventHandlerWithProps(handleOnTextCompositionEnd),
    onTextCut: createCursorEventHandler(handleOnTextCut),
    onTextCopy: createCursorEventHandler(handleOnTextCopy),
    onTextPaste: createCursorEventHandler(handleOnTextPaste),
    onSuggectionMouseDown: createCursorEventHandler(handleOnSuggectionMouseDown),
  };
}

export function useScrollbyHoldingMouse(
  text: string,
  selectionMouse: 'deactive' | 'fired' | 'active-in' | 'active-up' | 'active-down',
  readonly: boolean | undefined,
  setState: React.Dispatch<React.SetStateAction<State>>
): void {
  const timeIdRef = React.useRef<number>(0);

  React.useEffect(() => {
    switch (selectionMouse) {
      case 'active-up':
        if (readonly || timeIdRef.current) break;
        timeIdRef.current = window.setInterval(() => {
          setState((state) => handleOnMouseScrollUp(text, state));
        });
        break;
      case 'active-down':
        if (readonly || timeIdRef.current) break;
        timeIdRef.current = window.setInterval(() => {
          setState((state) => handleOnMouseScrollDown(text, state));
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
  }, [selectionMouse]);
}
