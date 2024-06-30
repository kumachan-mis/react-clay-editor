import { CursorCoordinate } from '../../../../types/cursor/cursorCoordinate';
import { CursorBar } from '../../../atoms/cursor/CursorBar';
import { CursorTextArea } from '../../../atoms/cursor/CursorTextArea';
import { SuggestionList } from '../../../atoms/suggestion/SuggesionList';
import { SuggestionListBody } from '../../../atoms/suggestion/SuggesionListBody';
import { SuggestionListHeader } from '../../../atoms/suggestion/SuggesionListHeader';
import { SuggestionListItem } from '../../../atoms/suggestion/SuggesionListItem';

import { useCursor } from './hooks';

export type CursorProps = {
  readonly cursorCoordinate: CursorCoordinate | undefined;
  readonly cursorScroll: 'none' | 'fired' | 'pause' | 'up' | 'down';
  readonly lineIds: string[];
  readonly textAreaValue: string;
  readonly suggestionType: 'text' | 'bracketLink' | 'hashtag' | 'taggedLink' | 'none';
  readonly suggestions: string[];
  readonly suggestionIndex: number;
  readonly onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  readonly onTextChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  readonly onTextCompositionStart: (event: React.CompositionEvent<HTMLTextAreaElement>) => void;
  readonly onTextCompositionEnd: (event: React.CompositionEvent<HTMLTextAreaElement>) => void;
  readonly onTextCut: (event: React.ClipboardEvent<HTMLTextAreaElement>) => void;
  readonly onTextCopy: (event: React.ClipboardEvent<HTMLTextAreaElement>) => void;
  readonly onTextPaste: (event: React.ClipboardEvent<HTMLTextAreaElement>) => void;
  readonly onSuggestionMouseDown: (event: React.MouseEvent<HTMLLIElement>) => void;
};

export const Cursor: React.FC<CursorProps> = (props) => {
  const { state, ref } = useCursor(props);

  return (
    <span ref={ref}>
      <CursorBar cursorSize={state.cursorSize} position={state.position} />
      <CursorTextArea
        cursorSize={state.cursorSize}
        onChange={props.onTextChange}
        onCompositionEnd={props.onTextCompositionEnd}
        onCompositionStart={props.onTextCompositionStart}
        onCopy={props.onTextCopy}
        onCut={props.onTextCut}
        onKeyDown={props.onKeyDown}
        onPaste={props.onTextPaste}
        position={state.position}
        value={props.textAreaValue}
      />
      {props.suggestions.length > 0 && (
        <SuggestionList cursorSize={state.cursorSize} position={state.position}>
          <SuggestionListHeader suggestionType={props.suggestionType} />
          <SuggestionListBody>
            {props.suggestions.map((suggestion, index) => (
              <SuggestionListItem
                aria-selected={props.suggestionIndex === index}
                index={index}
                key={index}
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
