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

export function useEditor(): [
  State,
  React.Dispatch<React.SetStateAction<State>>,
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
  const ref = React.useRef<HTMLDivElement | null>(null);

  return [state, setState, ref];
}

export function useMouseEventHandlers(
  props: Props,
  state: State,
  setState: React.Dispatch<React.SetStateAction<State>>,
  ref: React.MutableRefObject<HTMLDivElement | null>
): [
  {
    onMouseDown: React.MouseEventHandler<HTMLDivElement>;
    onMouseUp: React.MouseEventHandler<HTMLDivElement>;
  },
  {
    onMouseDown: React.MouseEventHandler<HTMLDivElement>;
    onClick: React.MouseEventHandler<HTMLDivElement>;
  }
] {
  const createMouseEventHandler = React.useCallback(
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

  const handleOnDocMouseDown = React.useCallback(() => {
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
  const handleOnDocMouseMove = React.useCallback(
    (event: MouseEvent) => {
      createMouseEventHandler(handleOnMouseMove)(event);
    },
    [createMouseEventHandler]
  );
  const handleOnDocMouseUp = React.useCallback(
    (event: MouseEvent) => {
      createMouseEventHandler(handleOnMouseUp)(event);
    },
    [createMouseEventHandler]
  );

  React.useEffect(() => {
    document.addEventListener('mousedown', handleOnDocMouseDown);
    return () => {
      document.removeEventListener('mousedown', handleOnDocMouseDown);
    };
  }, [handleOnDocMouseDown]);

  React.useEffect(() => {
    document.addEventListener('mousemove', handleOnDocMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleOnDocMouseMove);
    };
  }, [handleOnDocMouseMove]);

  React.useEffect(() => {
    document.addEventListener('mouseup', handleOnDocMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleOnDocMouseUp);
    };
  }, [handleOnDocMouseUp]);

  const handleOnRootMouseUp = React.useCallback(() => {
    ref.current?.querySelector('textarea')?.focus({ preventScroll: true });
  }, [ref]);
  const handleOnRootMouseDown = React.useCallback(
    (event: React.MouseEvent) => {
      event.nativeEvent.stopPropagation();
      document.addEventListener('mouseup', handleOnRootMouseUp);
    },
    [handleOnRootMouseUp]
  );

  const handleOnBodyMouseDown = React.useCallback(
    (event: React.MouseEvent) => {
      createMouseEventHandler(handleOnMouseDown)(event);
    },
    [createMouseEventHandler]
  );
  const handleOnBodyClick = React.useCallback(
    (event: React.MouseEvent) => {
      createMouseEventHandler(handleOnClick)(event);
    },
    [createMouseEventHandler]
  );

  return [
    { onMouseUp: handleOnRootMouseUp, onMouseDown: handleOnRootMouseDown },
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
