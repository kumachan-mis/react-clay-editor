import React from 'react';

import { getRoot } from '../Editor/utils';
import { selectIdProps } from '../common/utils';

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
  }, [props, state, setState, rootRef]);

  React.useEffect(() => {
    window.addEventListener('resize', _handleOnEditorScrollOrResize);
    const editorRoot = rootRef.current && getRoot(rootRef.current);
    if (editorRoot) editorRoot.addEventListener('scroll', _handleOnEditorScrollOrResize);

    return () => {
      if (editorRoot) editorRoot.removeEventListener('scroll', _handleOnEditorScrollOrResize);
      window.removeEventListener('resize', _handleOnEditorScrollOrResize);
    };
  }, [_handleOnEditorScrollOrResize]);

  React.useEffect(() => {
    if (!rootRef.current) return;
    const newState = cursorPropsToState(props, state, rootRef.current);
    if (newState !== state) setState(newState);
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

  if (suggestions.length === 0) return <></>;

  return (
    <div className={constants.list.className} style={constants.list.style(position, cursorSize)}>
      <div className={constants.header.className} {...selectIdProps(constants.header.selectId)}>
        {constants.header.name(props.suggestionType)}
      </div>
      <ul className={constants.container.className}>
        {suggestions.map((suggestion, index) => (
          <li
            key={index}
            className={constants.item.className}
            aria-selected={suggestionIndex === index}
            onMouseDown={(event) => props.onSuggectionMouseDown(event)}
            {...selectIdProps(constants.item.selectId(index))}
          >
            {suggestion}
          </li>
        ))}
      </ul>
    </div>
  );
};
