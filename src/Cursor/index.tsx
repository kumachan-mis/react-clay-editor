import * as React from 'react';

import { Props, State, CursorBarProps, HiddenTextAreaProps, SuggestionListProps } from './types';
import { CursorConstants } from './constants';
import { cursorPropsToState, handleOnEditorScroll } from './utils';

import { getRoot } from '../Editor/utils';

export const Cursor: React.FC<Props> = (props) => {
  const rootRef = React.useRef<HTMLSpanElement | null>(null);
  const [state, setState] = React.useState<State>({ position: { top: 0, left: 0 }, cursorSize: 0 });

  const _handleOnEditorScroll = React.useCallback((): void => {
    if (!rootRef.current) return;
    const newState = handleOnEditorScroll(props, state, rootRef.current);
    if (newState != state) setState(newState);
  }, [props, state, setState, rootRef]);

  React.useEffect(() => {
    const editorRoot = rootRef.current && getRoot(rootRef.current);
    if (editorRoot) editorRoot.addEventListener('scroll', _handleOnEditorScroll);
    return () => {
      if (editorRoot) editorRoot.removeEventListener('scroll', _handleOnEditorScroll);
    };
  });

  React.useEffect(() => {
    if (!rootRef.current) return;
    const newState = cursorPropsToState(props, state, rootRef.current);
    if (newState != state) setState(newState);
    // state should not be in dependencies because of infinite recursion
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props, rootRef]);

  return (
    <span ref={rootRef}>
      <CursorBar position={state.position} cursorSize={state.cursorSize} />
      <HiddenTextArea
        textAreaValue={props.textAreaValue}
        position={state.position}
        cursorSize={state.cursorSize}
        onKeyDown={props.onKeyDown}
        onTextChange={props.onTextChange}
        onTextCut={props.onTextCut}
        onTextCopy={props.onTextCopy}
        onTextPaste={props.onTextPaste}
        onTextCompositionStart={props.onTextCompositionStart}
        onTextCompositionEnd={props.onTextCompositionEnd}
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

const CursorBar: React.FC<CursorBarProps> = (props) => {
  const { position, cursorSize } = props;
  return (
    <div className={CursorConstants.cursorBar.className} style={CursorConstants.cursorBar.style(position, cursorSize)}>
      <svg width={CursorConstants.svg.width} height={cursorSize}>
        <rect
          x={CursorConstants.rect.x}
          y={CursorConstants.rect.y}
          width={CursorConstants.rect.width}
          height={CursorConstants.rect.height}
        />
      </svg>
    </div>
  );
};

const HiddenTextArea: React.FC<HiddenTextAreaProps> = (props) => {
  const constants = CursorConstants.textArea;
  const { textAreaValue, position, cursorSize } = props;
  return (
    <textarea
      className={constants.className}
      value={textAreaValue}
      wrap={constants.wrap}
      spellCheck={constants.spellCheck}
      autoCapitalize={constants.autoCapitalize}
      onKeyDown={(event) => props.onKeyDown(event)}
      onChange={(event) => props.onTextChange(event)}
      onCut={(event) => props.onTextCut(event)}
      onCopy={(event) => props.onTextCopy(event)}
      onPaste={(event) => props.onTextPaste(event)}
      onCompositionStart={(event) => props.onTextCompositionStart(event)}
      onCompositionEnd={(event) => props.onTextCompositionEnd(event)}
      style={constants.style(position, cursorSize, textAreaValue.length)}
    />
  );
};

const SuggestionList: React.FC<SuggestionListProps> = (props) => {
  const constants = CursorConstants.suggestion;
  const { suggestions, suggestionIndex, position, cursorSize } = props;
  return (
    <ul
      className={constants.list.className}
      style={constants.list.style(position, cursorSize, suggestions.length == 0)}
    >
      <li className={constants.header.className}>{constants.header.name(props.suggestionType)}</li>
      {suggestions.map((suggestion, index) => (
        <li
          key={index}
          aria-selected={suggestionIndex == index}
          className={constants.item.className(index)}
          onMouseDown={(event) => props.onSuggectionMouseDown(event)}
        >
          {suggestion}
        </li>
      ))}
    </ul>
  );
};
