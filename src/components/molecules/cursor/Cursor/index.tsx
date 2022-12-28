import { CursorCoordinate } from '../../../../types/cursor/cursorCoordinate';
import { CursorBar } from '../../../atoms/cursor/CursorBar';
import { CursorTextArea } from '../../../atoms/cursor/CursorTextArea';
import { SuggestionList } from '../../../atoms/suggestion/SuggesionList';
import { SuggestionListBody } from '../../../atoms/suggestion/SuggesionListBody';
import { SuggestionListHeader } from '../../../atoms/suggestion/SuggesionListHeader';
import { SuggestionListItem } from '../../../atoms/suggestion/SuggesionListItem';

import { useCursor } from './hooks';

import React from 'react';

export type CursorProps = {
  cursorCoordinate: CursorCoordinate | undefined;
  cursorScroll: 'none' | 'fired' | 'pause' | 'up' | 'down';
  textAreaValue: string;
  suggestionType: 'text' | 'bracketLink' | 'hashtag' | 'taggedLink' | 'none';
  suggestions: string[];
  suggestionIndex: number;
  onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onTextChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onTextCompositionStart: (event: React.CompositionEvent<HTMLTextAreaElement>) => void;
  onTextCompositionEnd: (event: React.CompositionEvent<HTMLTextAreaElement>) => void;
  onTextCut: (event: React.ClipboardEvent<HTMLTextAreaElement>) => void;
  onTextCopy: (event: React.ClipboardEvent<HTMLTextAreaElement>) => void;
  onTextPaste: (event: React.ClipboardEvent<HTMLTextAreaElement>) => void;
  onSuggestionMouseDown: (event: React.MouseEvent<HTMLLIElement>) => void;
};

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
                onMouseDown={props.onSuggestionMouseDown}
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
