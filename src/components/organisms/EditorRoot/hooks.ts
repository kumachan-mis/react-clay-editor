import React from 'react';

import {
  defaultEditorStateValue,
  useEditorStateContext,
  useSetEditorStateContext,
} from '../../../contexts/EditorStateContext';
import { useEditorTextValueContext } from '../../../contexts/EditorTextContext';

import { handleOnMouseMove, handleOnMouseScrollDown, handleOnMouseScrollUp, handleOnMouseUp } from './callbacks';

export function useEditorRoot(): {
  ref: React.RefObject<HTMLDivElement>;
  onMouseDown: React.MouseEventHandler<HTMLDivElement>;
} {
  const ref = React.useRef<HTMLDivElement>(null);

  const onDocumentMouseUp = React.useCallback(() => {
    ref.current?.querySelector('textarea')?.focus({ preventScroll: true });
    document.removeEventListener('mouseup', onDocumentMouseUp);
  }, [ref]);

  const onMouseDown = React.useCallback(
    (event: React.MouseEvent) => {
      document.addEventListener('mouseup', onDocumentMouseUp);
      event.nativeEvent.stopPropagation();
    },
    [onDocumentMouseUp]
  );

  return { ref, onMouseDown };
}

export function useDocument(ref: React.RefObject<HTMLDivElement>): void {
  const text = useEditorTextValueContext();
  const setState = useSetEditorStateContext();

  const onMouseDown = React.useCallback(() => {
    setState((state) => ({
      ...defaultEditorStateValue,
      editActionHistory: state.editActionHistory,
      editActionHistoryHead: state.editActionHistoryHead,
    }));
  }, [setState]);

  const onMouseMove = React.useCallback(
    (event: MouseEvent) => {
      if (event.button !== 0) return;
      setState((state) => handleOnMouseMove(text, state, event, ref.current));
    },
    [setState, text, ref]
  );

  const onMouseUp = React.useCallback(
    (event: MouseEvent) => {
      if (event.button !== 0) return;
      setState((state) => handleOnMouseUp(text, state, event, ref.current));
    },
    [setState, text, ref]
  );

  React.useEffect(() => {
    document.addEventListener('mousedown', onMouseDown);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
    };
  }, [onMouseDown]);

  React.useEffect(() => {
    document.addEventListener('mousemove', onMouseMove);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, [onMouseMove]);

  React.useEffect(() => {
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [onMouseUp]);
}

export function useScroll(): void {
  const text = useEditorTextValueContext();
  const [{ cursorScroll }, setState] = useEditorStateContext();

  const timeIdRef = React.useRef<number>(0);

  React.useEffect(() => {
    switch (cursorScroll) {
      case 'up':
        if (timeIdRef.current) break;
        timeIdRef.current = window.setInterval(() => {
          setState((state) => handleOnMouseScrollUp(text, state));
        });
        break;
      case 'down':
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
  }, [cursorScroll]);
}
