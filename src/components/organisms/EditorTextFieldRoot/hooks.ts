import { useSetEditorStateContext } from '../../../contexts/EditorStateContext';
import { useTextValueContext } from '../../../contexts/TextContext';
import { useTextNodesValueContext } from '../../../contexts/TextNodesContext';
import { topLevelNodeToLineNodes } from '../../../parser/text/topLevelNode';

import { handleOnMouseDown, handleOnClick } from './callback';

import React from 'react';

type UseTextFieldReturn = {
  ref: React.RefObject<HTMLDivElement | null>;
  onMouseDown: React.MouseEventHandler<HTMLDivElement>;
  onClick: React.MouseEventHandler<HTMLDivElement>;
};

export function useTextField(): UseTextFieldReturn {
  const text = useTextValueContext();
  const nodes = useTextNodesValueContext();
  const setState = useSetEditorStateContext();
  const ref = React.useRef<HTMLDivElement>(null);

  const lineIdToIndex = React.useMemo(() => {
    const map = new Map<string, number>();
    for (const [index, node] of topLevelNodeToLineNodes(nodes).entries()) {
      map.set(node.lineId, index);
    }
    return map;
  }, [nodes]);

  const onMouseDown = React.useCallback(
    (event: React.MouseEvent) => {
      if (event.button !== 0) return;
      setState((state) => handleOnMouseDown(text, lineIdToIndex, state, event, ref.current));
    },
    [setState, text, lineIdToIndex, ref],
  );

  const onClick = React.useCallback(
    (event: React.MouseEvent) => {
      if (event.button !== 0) return;
      setState((state) => handleOnClick(text, lineIdToIndex, state, event, ref.current));
    },
    [setState, text, lineIdToIndex, ref],
  );

  return { ref, onMouseDown, onClick };
}
