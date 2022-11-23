import React from 'react';

import { getTextFieldBody } from '../../../atoms/editor/TextFieldBody/utils';
import { getTextFieldRoot } from '../../../atoms/editor/TextFieldRoot/utils';
import { SuggestionListBodyConstants } from '../../../atoms/suggestion/SuggesionListBody';
import { SuggestionListItemConstants } from '../../../atoms/suggestion/SuggesionListItem';
import { getCharAt } from '../../../atoms/text/Char/utils';

import { CursorProps, CursorState } from './types';

export function useCursor(props: CursorProps): { state: CursorState; ref: React.RefObject<HTMLSpanElement> } {
  const [state, setState] = React.useState<CursorState>({ position: { top: 0, left: 0 }, cursorSize: 0 });
  const ref = React.useRef<HTMLSpanElement>(null);

  const handleOnScrollOrResize = React.useCallback((): void => {
    if (!ref.current) return;
    const newState = propsToStateOnScrollOrResize(props, state, ref.current);
    if (newState !== state) setState(newState);
  }, [props, state]);

  React.useEffect(() => {
    if (!ref.current) return;
    const newState = propsToState(props, state, ref.current);
    if (newState !== state) setState(newState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  React.useEffect(() => {
    window.addEventListener('resize', handleOnScrollOrResize);
    return () => {
      window.removeEventListener('resize', handleOnScrollOrResize);
    };
  }, [handleOnScrollOrResize]);

  React.useEffect(() => {
    const textFieldRootElement = ref.current && getTextFieldRoot(ref.current);
    textFieldRootElement?.addEventListener('scroll', handleOnScrollOrResize);
    return () => {
      textFieldRootElement?.removeEventListener('scroll', handleOnScrollOrResize);
    };
  }, [handleOnScrollOrResize]);

  React.useEffect(() => {
    if (!ref.current) return;
    scrollSelectedSuggestionIntoView(props.suggestionIndex, ref.current);
  }, [props.suggestionIndex]);

  return { state, ref };
}

function propsToState(props: CursorProps, state: CursorState, element: HTMLElement): CursorState {
  const textFieldRootElement = getTextFieldRoot(element);

  const textFieldRootRect = textFieldRootElement?.getBoundingClientRect();
  const textFieldBodyRect = getTextFieldBody(element)?.getBoundingClientRect();
  if (!props.cursorCoordinate || !textFieldBodyRect || !textFieldRootElement || !textFieldRootRect) {
    return { ...state, position: { top: 0, left: 0 }, cursorSize: 0 };
  }

  const charElement = getCharAt(props.cursorCoordinate.lineIndex, props.cursorCoordinate.charIndex, element);
  const charRect = charElement?.getBoundingClientRect();
  if (!charElement || !charRect) return { ...state, position: { top: 0, left: 0 }, cursorSize: 0 };

  const position = { top: charRect.top - textFieldBodyRect.top, left: charRect.left - textFieldBodyRect.left };
  const [cursorSize, margin] = [charRect.height, 4];
  if (props.cursorScroll === 'pause') return { ...state, position, cursorSize };

  if (charRect.top - textFieldRootRect.top - margin < 0) {
    textFieldRootElement.scrollTop += charRect.top - textFieldRootRect.top;
    return propsToStateOnScrollOrResize(props, state, element);
  } else if (charRect.top + cursorSize - textFieldRootRect.top > textFieldRootRect.height - margin) {
    textFieldRootElement.scrollTop += charRect.top + cursorSize - textFieldRootRect.top - textFieldRootRect.height;
    return propsToStateOnScrollOrResize(props, state, element);
  }

  return { ...state, position, cursorSize };
}

function propsToStateOnScrollOrResize(props: CursorProps, state: CursorState, element: HTMLElement): CursorState {
  const textFieldBodyRect = getTextFieldBody(element)?.getBoundingClientRect();
  if (!props.cursorCoordinate || !textFieldBodyRect) return { ...state, position: { top: 0, left: 0 }, cursorSize: 0 };

  const { cursorCoordinate: coordinate } = props;
  const charElement = getCharAt(coordinate.lineIndex, coordinate.charIndex, element);
  const charRect = charElement?.getBoundingClientRect();
  if (!charElement || !charRect) return { ...state, position: { top: 0, left: 0 }, cursorSize: 0 };

  const position = { top: charRect.top - textFieldBodyRect.top, left: charRect.left - textFieldBodyRect.left };
  const cursorSize = charRect.height;
  return { ...state, position, cursorSize };
}

function scrollSelectedSuggestionIntoView(suggestionIndex: number, element: HTMLElement): void {
  const textFieldRootElement = getTextFieldRoot(element);

  const listSelector = `ul[data-selectid="${SuggestionListBodyConstants.selectId}"]`;
  const list = textFieldRootElement?.querySelector<HTMLUListElement>(listSelector);
  if (!list) return;

  const listItemSelector = `li[data-selectid="${SuggestionListItemConstants.selectId(suggestionIndex)}"]`;
  const listItem = textFieldRootElement?.querySelector<HTMLLIElement>(listItemSelector);
  if (!listItem) return;

  if (listItem.offsetTop < list.scrollTop) {
    list.scrollTop = listItem.offsetTop;
  } else if (listItem.offsetTop + listItem.clientHeight > list.scrollTop + list.clientHeight) {
    list.scrollTop = listItem.offsetTop + listItem.clientHeight - list.clientHeight;
  }
}
