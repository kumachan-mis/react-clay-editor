import React from 'react';

import { getEditor, getBody } from '../../../../Editor/utils';
import { SuggestionListBodyConstants } from '../../../atoms/suggestion/SuggesionListBody';
import { SuggestionListItemConstants } from '../../../atoms/suggestion/SuggesionListItem';
import { getCharAt } from '../../../atoms/text/Char/utils';

import { Props, State } from './types';

export function useCursor(props: Props): { state: State; ref: React.RefObject<HTMLSpanElement> } {
  const [state, setState] = React.useState<State>({ position: { top: 0, left: 0 }, cursorSize: 0 });
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
    const editorElement = ref.current && getEditor(ref.current);
    editorElement?.addEventListener('scroll', handleOnScrollOrResize);
    return () => {
      editorElement?.removeEventListener('scroll', handleOnScrollOrResize);
    };
  }, [handleOnScrollOrResize]);

  React.useEffect(() => {
    if (!ref.current) return;
    scrollSelectedSuggestionIntoView(props.suggestionIndex, ref.current);
  }, [props.suggestionIndex]);

  return { state, ref };
}

function propsToState(props: Props, state: State, element: HTMLElement): State {
  const editorElement = getEditor(element);

  const editorRect = editorElement?.getBoundingClientRect();
  const bodyRect = getBody(element)?.getBoundingClientRect();
  if (!props.coordinate || !bodyRect || !editorElement || !editorRect) {
    return { ...state, position: { top: 0, left: 0 }, cursorSize: 0 };
  }

  const charElement = getCharAt(props.coordinate.lineIndex, props.coordinate.charIndex, element);
  const charRect = charElement?.getBoundingClientRect();
  if (!charElement || !charRect) return { ...state, position: { top: 0, left: 0 }, cursorSize: 0 };

  const position = { top: charRect.top - bodyRect.top, left: charRect.left - bodyRect.left };
  const [cursorSize, margin] = [charRect.height, 4];
  if (props.mouseHold === 'active-in') return { ...state, position, cursorSize };

  if (charRect.top - editorRect.top - margin < 0) {
    editorElement.scrollTop += charRect.top - editorRect.top;
    return propsToStateOnScrollOrResize(props, state, element);
  } else if (charRect.top + cursorSize - editorRect.top > editorRect.height - margin) {
    editorElement.scrollTop += charRect.top + cursorSize - editorRect.top - editorRect.height;
    return propsToStateOnScrollOrResize(props, state, element);
  }

  return { ...state, position, cursorSize };
}

function propsToStateOnScrollOrResize(props: Props, state: State, element: HTMLElement): State {
  const bodyRect = getBody(element)?.getBoundingClientRect();
  if (!props.coordinate || !bodyRect) return { ...state, position: { top: 0, left: 0 }, cursorSize: 0 };

  const { coordinate } = props;
  const charElement = getCharAt(coordinate.lineIndex, coordinate.charIndex, element);
  const charRect = charElement?.getBoundingClientRect();
  if (!charElement || !charRect) return { ...state, position: { top: 0, left: 0 }, cursorSize: 0 };

  const position = { top: charRect.top - bodyRect.top, left: charRect.left - bodyRect.left };
  const cursorSize = charRect.height;
  return { ...state, position, cursorSize };
}

function scrollSelectedSuggestionIntoView(suggestionIndex: number, element: HTMLElement): void {
  const editorElement = getEditor(element);

  const listSelector = `ul[data-selectid="${SuggestionListBodyConstants.selectId}"]`;
  const list = editorElement?.querySelector<HTMLUListElement>(listSelector);
  if (!list) return;

  const listItemSelector = `li[data-selectid="${SuggestionListItemConstants.selectId(suggestionIndex)}"]`;
  const listItem = editorElement?.querySelector<HTMLLIElement>(listItemSelector);
  if (!listItem) return;

  if (listItem.offsetTop < list.scrollTop) {
    list.scrollTop = listItem.offsetTop;
  } else if (listItem.offsetTop + listItem.clientHeight > list.scrollTop + list.clientHeight) {
    list.scrollTop = listItem.offsetTop + listItem.clientHeight - list.clientHeight;
  }
}
