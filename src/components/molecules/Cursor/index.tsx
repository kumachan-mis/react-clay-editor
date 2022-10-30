import React from 'react';

import { CursorBar } from '../../atoms/CursorBar';
import { CursorTextArea } from '../../atoms/CursorTextArea';
import { SuggestionList } from '../../atoms/SuggesionList';
import { SuggestionListBody } from '../../atoms/SuggesionListBody';
import { SuggestionListHeader } from '../../atoms/SuggesionListHeader';
import { SuggestionListItem } from '../../atoms/SuggesionListItem';

import { useCursor } from './hooks';
import { Props } from './types';

export const Cursor: React.FC<Props> = (props) => {
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
