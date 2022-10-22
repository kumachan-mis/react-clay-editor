import React from 'react';

import { getEditor } from '../Editor/utils';

import { CursorConstants } from './constants';
import { Props, State, CursorBarProps, HiddenTextAreaProps, SuggestionListProps } from './types';
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
        textAreaValue={props.textAreaValue}
        position={state.position}
        cursorSize={state.cursorSize}
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
  const { textAreaValue, position, cursorSize, ...handlers } = props;
  return (
    <textarea
      className={constants.className}
      value={textAreaValue}
      wrap={constants.wrap}
      spellCheck={constants.spellCheck}
      autoCapitalize={constants.autoCapitalize}
      style={constants.style(position, cursorSize, textAreaValue.length)}
      {...handlers}
    />
  );
};

const SuggestionList: React.FC<SuggestionListProps> = (props) => {
  const constants = CursorConstants.suggestion;
  const { suggestions, suggestionIndex, position, cursorSize } = props;

  if (suggestions.length === 0) return <></>;

  return (
    <div className={constants.list.className} style={constants.list.style(position, cursorSize)}>
      <div className={constants.header.className} data-selectid={constants.header.selectId}>
        {constants.header.name(props.suggestionType)}
      </div>
      <ul className={constants.container.className} data-selectid={constants.container.selectId}>
        {suggestions.map((suggestion, index) => (
          <li
            key={index}
            className={constants.item.className}
            aria-selected={suggestionIndex === index}
            onMouseDown={(event) => props.onSuggectionMouseDown(event)}
            data-selectid={constants.item.selectId(index)}
          >
            {suggestion}
          </li>
        ))}
      </ul>
    </div>
  );
};
