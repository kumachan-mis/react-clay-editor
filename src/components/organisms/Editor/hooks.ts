import React from 'react';

import {
  handleOnKeyDown,
  handleOnTextChange,
  handleOnTextCut,
  handleOnTextCopy,
  handleOnTextPaste,
  handleOnTextCompositionStart,
  handleOnTextCompositionEnd,
  handleOnSuggectionMouseDown,
} from './callbacks/keyboard';
import {
  handleOnMouseDown,
  handleOnMouseMove,
  handleOnMouseUp,
  handleOnClick,
  handleOnMouseScrollUp,
  handleOnMouseScrollDown,
} from './callbacks/mouse';
import { Props, State } from './types';

export function useEditorState(
  props: Props,
  ref: React.MutableRefObject<HTMLDivElement | null>
): {
  state: State;
  setState: React.Dispatch<React.SetStateAction<State>>;
} {
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

  const createEventHandler = React.useCallback(
    <Event extends MouseEvent | React.MouseEvent>(
      handler: (text: string, state: State, event: Event, root: HTMLElement | null) => [string, State]
    ): ((event: Event) => void) => {
      return (event) => {
        if (event.button !== 0) return;
        const [newText, newState] = handler(props.text, state, event, ref.current);
        if (newState !== state) setState(newState);
        if (newText !== props.text) props.onChangeText(newText);
      };
    },
    [props, state, ref, setState]
  );

  const handleOnDocumentMouseDown = React.useCallback(() => {
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
  }, [state, setState]);

  const handleOnDocumentMouseMove = React.useCallback(
    (event: MouseEvent) => {
      createEventHandler(handleOnMouseMove)(event);
    },
    [createEventHandler]
  );

  const handleOnDocumentMouseUp = React.useCallback(
    (event: MouseEvent) => {
      createEventHandler(handleOnMouseUp)(event);
    },
    [createEventHandler]
  );

  React.useEffect(() => {
    document.addEventListener('mousedown', handleOnDocumentMouseDown);
    return () => {
      document.removeEventListener('mousedown', handleOnDocumentMouseDown);
    };
  }, [handleOnDocumentMouseDown]);

  React.useEffect(() => {
    document.addEventListener('mousemove', handleOnDocumentMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleOnDocumentMouseMove);
    };
  }, [handleOnDocumentMouseMove]);

  React.useEffect(() => {
    document.addEventListener('mouseup', handleOnDocumentMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleOnDocumentMouseUp);
    };
  }, [handleOnDocumentMouseUp]);

  return { state, setState };
}

export function useEditorRootEventHandlers(ref: React.MutableRefObject<HTMLDivElement | null>): {
  onMouseDown: React.MouseEventHandler<HTMLDivElement>;
} {
  const handleOnDocumentMouseUpTemporary = React.useCallback(() => {
    ref.current?.querySelector('textarea')?.focus({ preventScroll: true });
  }, [ref]);

  const handleOnTextFieldRootMouseDown = React.useCallback(
    (event: React.MouseEvent) => {
      document.addEventListener('mouseup', handleOnDocumentMouseUpTemporary);
      event.nativeEvent.stopPropagation();
    },
    [handleOnDocumentMouseUpTemporary]
  );

  return { onMouseDown: handleOnTextFieldRootMouseDown };
}

export function useTextFieldBodyEventHandlers(
  props: Props,
  state: State,
  setState: React.Dispatch<React.SetStateAction<State>>,
  ref: React.MutableRefObject<HTMLDivElement | null>
): {
  onMouseDown: React.MouseEventHandler<HTMLDivElement>;
  onClick: React.MouseEventHandler<HTMLDivElement>;
} {
  const createEventHandler = React.useCallback(
    <Event extends MouseEvent | React.MouseEvent>(
      handler: (text: string, state: State, event: Event, root: HTMLElement | null) => [string, State]
    ): ((event: Event) => void) => {
      return (event) => {
        if (event.button !== 0) return;
        const [newText, newState] = handler(props.text, state, event, ref.current);
        if (newState !== state) setState(newState);
        if (newText !== props.text) props.onChangeText(newText);
      };
    },
    [props, state, ref, setState]
  );

  const handleOnTextFieldBodyMouseDown = React.useCallback(
    (event: React.MouseEvent) => {
      createEventHandler(handleOnMouseDown)(event);
    },
    [createEventHandler]
  );

  const handleOnTextFieldBodyClick = React.useCallback(
    (event: React.MouseEvent) => {
      createEventHandler(handleOnClick)(event);
    },
    [createEventHandler]
  );

  return { onMouseDown: handleOnTextFieldBodyMouseDown, onClick: handleOnTextFieldBodyClick };
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
  const createEventHandler = React.useCallback(
    <Event>(handler: (text: string, state: State, event: Event) => [string, State]): ((event: Event) => void) => {
      return (event) => {
        const [newText, newState] = handler(props.text, state, event);
        if (newState !== state) setState(newState);
        if (newText !== props.text) props.onChangeText(newText);
      };
    },
    [props, state, setState]
  );

  const createEventHandlerWithProps = React.useCallback(
    <Event>(
      handler: (text: string, props: Props, state: State, event: Event) => [string, State]
    ): ((event: Event) => void) => {
      return (event) => {
        const [newText, newState] = handler(props.text, props, state, event);
        if (newState !== state) setState(newState);
        if (newText !== props.text) props.onChangeText(newText);
      };
    },
    [props, state, setState]
  );

  return {
    onKeyDown: createEventHandlerWithProps(handleOnKeyDown),
    onTextChange: createEventHandlerWithProps(handleOnTextChange),
    onTextCompositionStart: createEventHandler(handleOnTextCompositionStart),
    onTextCompositionEnd: createEventHandlerWithProps(handleOnTextCompositionEnd),
    onTextCut: createEventHandler(handleOnTextCut),
    onTextCopy: createEventHandler(handleOnTextCopy),
    onTextPaste: createEventHandler(handleOnTextPaste),
    onSuggectionMouseDown: createEventHandler(handleOnSuggectionMouseDown),
  };
}

export function useScroll(
  text: string,
  selectionMouse: 'deactive' | 'fired' | 'active-in' | 'active-up' | 'active-down',
  setState: React.Dispatch<React.SetStateAction<State>>
): void {
  const timeIdRef = React.useRef<number>(0);

  React.useEffect(() => {
    switch (selectionMouse) {
      case 'active-up':
        if (timeIdRef.current) break;
        timeIdRef.current = window.setInterval(() => {
          setState((state) => handleOnMouseScrollUp(text, state));
        });
        break;
      case 'active-down':
        if (timeIdRef.current) break;
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
