import React from 'react';

import { getTextFieldBody } from '../../../atoms/editor/TextFieldBody/utils';
import { getCharAt } from '../../../atoms/text/Char/utils';

import { Props, State } from './types';
import { selectionToRange } from './utils';

export function useSelection(props: Props): { state: State; ref: React.RefObject<HTMLSpanElement> } {
  const [state, setState] = React.useState<State>({
    topRectProps: undefined,
    centerRectProps: undefined,
    bottomRectProps: undefined,
  });

  const ref = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    if (!ref.current) return;
    const newState = propsToState(props, ref.current);
    if (newState !== state) setState(newState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  const handleOnResize = React.useCallback((): void => {
    if (!ref.current) return;
    const newState = propsToState(props, ref.current);
    if (newState !== state) setState(newState);
  }, [props, state]);

  React.useEffect(() => {
    window.addEventListener('resize', handleOnResize);
    return () => {
      window.removeEventListener('resize', handleOnResize);
    };
  }, [handleOnResize]);

  return { state, ref };
}

function propsToState(props: Props, element: HTMLElement): State {
  const textFieldBodyRect = getTextFieldBody(element)?.getBoundingClientRect();
  if (!props.textSelection || !textFieldBodyRect) {
    return { topRectProps: undefined, centerRectProps: undefined, bottomRectProps: undefined };
  }

  const { start, end } = selectionToRange(props.textSelection);
  const startElement = getCharAt(start.lineIndex, start.charIndex, element);
  const endElement = getCharAt(end.lineIndex, end.charIndex, element);
  const startRect = startElement?.getBoundingClientRect();
  const endRect = endElement?.getBoundingClientRect();

  if (!startRect || !endRect) {
    return { topRectProps: undefined, centerRectProps: undefined, bottomRectProps: undefined };
  }

  const startRectCenter = startRect.bottom - (startRect.bottom - startRect.top) / 2;
  const endRectCenter = endRect.bottom - (endRect.bottom - endRect.top) / 2;
  if (
    (startRect.top <= endRectCenter && endRectCenter <= startRect.bottom) ||
    (endRect.top <= startRectCenter && startRectCenter <= endRect.bottom)
  ) {
    const centerRectProps = {
      top: Math.min(startRect.top, endRect.top) - textFieldBodyRect.top,
      left: startRect.left - textFieldBodyRect.left,
      width: endRect.left - startRect.left,
      height: Math.max(startRect.bottom, endRect.bottom) - Math.min(startRect.top, endRect.top),
    };
    return { topRectProps: undefined, centerRectProps, bottomRectProps: undefined };
  }

  const topRectProps = {
    top: startRect.top - textFieldBodyRect.top,
    left: startRect.left - textFieldBodyRect.left,
    width: textFieldBodyRect.right - startRect.left,
    height: startRect.height,
  };
  const centerRectProps = {
    top: startRect.bottom - textFieldBodyRect.top,
    left: 0,
    width: textFieldBodyRect.width,
    height: endRect.top - startRect.bottom,
  };
  const bottomRectProps = {
    top: endRect.top - textFieldBodyRect.top,
    left: 0,
    width: endRect.left - textFieldBodyRect.left,
    height: endRect.height,
  };
  return { topRectProps, centerRectProps, bottomRectProps };
}
