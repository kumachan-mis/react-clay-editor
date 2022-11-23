import React from 'react';

import { CursorBar } from '../../../atoms/cursor/CursorBar';
import { CursorTextArea } from '../../../atoms/cursor/CursorTextArea';
import { SuggestionList } from '../../../atoms/suggestion/SuggesionList';
import { SuggestionListBody } from '../../../atoms/suggestion/SuggesionListBody';
import { SuggestionListHeader } from '../../../atoms/suggestion/SuggesionListHeader';
import { SuggestionListItem } from '../../../atoms/suggestion/SuggesionListItem';

import { useCursor } from './hooks';
import { CursorProps } from './types';

export const Cursor: React.FC<CursorProps> = (props) => {
  const { state, ref } = useCursor(props);

  return (
    <span ref={ref}>
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
