import React from 'react';

import { getEditor } from '../Editor/utils';
import { CursorBar } from '../components/atoms/CursorBar';
import { CursorTextArea } from '../components/atoms/CursorTextArea';
import { SuggestionList } from '../components/atoms/SuggesionList';
import { SuggestionListBody } from '../components/atoms/SuggesionListBody';
import { SuggestionListHeader } from '../components/atoms/SuggesionListHeader';
import { SuggestionListItem } from '../components/atoms/SuggesionListItem';

import { Props, State } from './types';
import { cursorPropsToState, handleOnEditorScrollOrResize } from './utils';

export const Cursor: React.FC<Props> = (props) => {
  const [state, setState] = React.useState<State>({ position: { top: 0, left: 0 }, cursorSize: 0 });
  const rootRef = React.useRef<HTMLSpanElement | null>(null);

  const _handleOnEditorScrollOrResize = React.useCallback((): void => {
    if (!rootRef.current) return;
    const newState = handleOnEditorScrollOrResize(props, state, rootRef.current);
    if (newState !== state) setState(newState);
  }, [props, state]);

  React.useEffect(() => {
    window.addEventListener('resize', _handleOnEditorScrollOrResize);
    const editorElement = rootRef.current && getEditor(rootRef.current);
    if (editorElement) editorElement.addEventListener('scroll', _handleOnEditorScrollOrResize);

    return () => {
      if (editorElement) editorElement.removeEventListener('scroll', _handleOnEditorScrollOrResize);
      window.removeEventListener('resize', _handleOnEditorScrollOrResize);
    };
  }, [_handleOnEditorScrollOrResize]);

  React.useEffect(() => {
    if (!rootRef.current) return;
    const newState = cursorPropsToState(props, state, rootRef.current);
    if (newState !== state) setState(newState);
    // state should not be in dependencies because of infinite recursion
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  return (
    <span ref={rootRef}>
      <CursorBar position={state.position} cursorSize={state.cursorSize} />
      <CursorTextArea
        position={state.position}
        cursorSize={state.cursorSize}
        value={props.textAreaValue}
        onKeyDown={props.onKeyDown}
        onChange={props.onTextChange}
        onCompositionStart={props.onTextCompositionStart}
        onCompositionEnd={props.onTextCompositionEnd}
        onCut={props.onTextCut}
        onCopy={props.onTextCopy}
        onPaste={props.onTextPaste}
      />
      {props.suggestions.length > 0 && (
        <SuggestionList position={state.position} cursorSize={state.cursorSize}>
          <SuggestionListHeader suggestionType={props.suggestionType} />
          <SuggestionListBody>
            {props.suggestions.map((suggestion, index) => (
              <SuggestionListItem
                key={index}
                index={index}
                aria-selected={props.suggestionIndex === index}
                onMouseDown={props.onSuggectionMouseDown}
              >
                {suggestion}
              </SuggestionListItem>
            ))}
          </SuggestionListBody>
        </SuggestionList>
      )}
    </span>
  );
};
