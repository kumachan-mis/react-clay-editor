import React from 'react';

import { useSetEditorStateContext } from '../../../contexts/EditorStateContext';
import { useTextValueContext } from '../../../contexts/TextContext';

import { handleOnMouseDown, handleOnClick } from './callback';

export function useTextField(): {
  ref: React.RefObject<HTMLDivElement>;
  onMouseDown: React.MouseEventHandler<HTMLDivElement>;
  onClick: React.MouseEventHandler<HTMLDivElement>;
} {
  const text = useTextValueContext();
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
