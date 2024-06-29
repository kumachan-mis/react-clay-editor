import {
  defaultEditorStateValue,
  useEditorStateContext,
  useSetEditorStateContext,
} from '../../../contexts/EditorStateContext';
import { useTextValueContext } from '../../../contexts/TextContext';
import { useTextNodesValueContext } from '../../../contexts/TextNodesContext';
import { topLevelNodeToLineNodes } from '../../../parser/text/topLevelNode';

import { handleOnMouseMove, handleOnMouseScrollDown, handleOnMouseScrollUp, handleOnMouseUp } from './callbacks';

import React from 'react';

type UseWindowProps = {
  ref: React.RefObject<HTMLDivElement>;
};

type UseEditorRootProps = {
  ref: React.RefObject<HTMLDivElement>;
};

type UseEditorRootReturn = {
  onMouseDown: React.MouseEventHandler<HTMLDivElement>;
};

export function useWindow({ ref }: UseWindowProps): void {
  const text = useTextValueContext();
  const nodes = useTextNodesValueContext();
  const setState = useSetEditorStateContext();

  const lineIdToIndex = React.useMemo(() => {
    const map = new Map<string, number>();
    for (const [index, node] of topLevelNodeToLineNodes(nodes).entries()) {
      map.set(node.lineId, index);
    }
    return map;
  }, [nodes]);

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
      setState((state) => handleOnMouseMove(text, lineIdToIndex, state, event, ref.current));
    },
    [setState, text, lineIdToIndex, ref]
  );

  const onMouseUp = React.useCallback(
    (event: MouseEvent) => {
      if (event.button !== 0) return;
      setState((state) => handleOnMouseUp(text, lineIdToIndex, state, event, ref.current));
    },
    [setState, text, lineIdToIndex, ref]
  );

  React.useEffect(() => {
    window.addEventListener('mousedown', onMouseDown);
    return () => {
      window.removeEventListener('mousedown', onMouseDown);
    };
  }, [onMouseDown]);

  React.useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [onMouseMove]);

  React.useEffect(() => {
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [onMouseUp]);
}

export function useEditorRoot({ ref }: UseEditorRootProps): UseEditorRootReturn {
  const onWindowMouseUp = React.useCallback(() => {
    ref.current?.querySelector('textarea')?.focus({ preventScroll: true });
    window.removeEventListener('mouseup', onWindowMouseUp);
  }, [ref]);

  const onMouseDown = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      window.addEventListener('mouseup', onWindowMouseUp);
      event.nativeEvent.stopPropagation();
    },
    [onWindowMouseUp]
  );

  return { onMouseDown };
}

export function useScroll(): void {
  const text = useTextValueContext();
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
