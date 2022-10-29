import React from 'react';

import { getEditor } from '../Editor/utils';
import { CursorBar } from '../components/atoms/Cursor/CursorBar';
import { HiddenTextArea } from '../components/atoms/Cursor/HiddenTextArea';
import { SuggestionListBody } from '../components/atoms/Cursor/SuggesionListBody';
import { SuggestionListContainer } from '../components/atoms/Cursor/SuggesionListContainer';
import { SuggestionListHeader } from '../components/atoms/Cursor/SuggesionListHeader';
import { SuggestionListItem } from '../components/atoms/Cursor/SuggesionListItem';

import { Props, State, SuggestionListProps } from './types';
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
      <HiddenTextArea
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
      <SuggestionList
        suggestionType={props.suggestionType}
        suggestions={props.suggestions}
        suggestionIndex={props.suggestionIndex}
        position={state.position}
        cursorSize={state.cursorSize}
        onSuggectionMouseDown={props.onSuggectionMouseDown}
      />
    </span>
  );
};

const SuggestionList: React.FC<SuggestionListProps> = ({
  suggestionType,
  suggestions,
  suggestionIndex,
  position,
  cursorSize,
  onSuggectionMouseDown,
}) =>
  suggestions.length === 0 ? (
    <></>
  ) : (
    <SuggestionListContainer position={position} cursorSize={cursorSize}>
      <SuggestionListHeader suggestionType={suggestionType} />
      <SuggestionListBody>
        {suggestions.map((suggestion, index) => (
          <SuggestionListItem
            key={index}
            index={index}
            aria-selected={suggestionIndex === index}
            onMouseDown={onSuggectionMouseDown}
          >
            {suggestion}
          </SuggestionListItem>
        ))}
      </SuggestionListBody>
    </SuggestionListContainer>
  );
