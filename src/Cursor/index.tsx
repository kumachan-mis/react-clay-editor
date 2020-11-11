import * as React from "react";

import { Props, State, CursorBarProps, HiddenTextAreaProps, SuggestionListProps } from "./types";
import { CursorConstants, defaultSuggestionListDecoration } from "./constants";
import { cursorPropsToState, handleOnEditorScroll as handleOnEditorScroll_ } from "./utils";
import "../style.css";

import { getRoot } from "../Editor/utils";

export const Cursor: React.FC<Props> = (props) => {
  const [state, setState] = React.useState<State>({
    position: { top: 0, left: 0 },
    cursorSize: 0,
  });
  const rootRef = React.createRef<HTMLSpanElement>();

  const handleOnEditorScroll = (): void => {
    if (!rootRef.current) return;
    const newState = handleOnEditorScroll_(props, state, rootRef.current);
    if (newState != state) setState(newState);
  };

  React.useEffect(() => {
    if (!rootRef.current) return;
    const newState = cursorPropsToState(props, state, rootRef.current);
    if (newState != state) setState(newState);

    const editorRoot = getRoot(rootRef.current);
    if (!editorRoot) return;
    editorRoot.removeEventListener("scroll", handleOnEditorScroll);
    editorRoot.addEventListener("scroll", handleOnEditorScroll);
  }, [props]);

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
        suggestionListDecoration={props.suggestionListDecoration}
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
    <div
      className={CursorConstants.rootDiv.className}
      style={CursorConstants.rootDiv.style(position, cursorSize)}
    >
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
  const { width, maxHeight, fontSize } =
    props.suggestionListDecoration || defaultSuggestionListDecoration;
  return (
    <ul
      className={constants.list.className}
      style={constants.list.style(position, cursorSize, width, maxHeight, suggestions.length == 0)}
    >
      {suggestions.map((suggestion: string, index: number) => (
        <li
          key={index}
          aria-selected={suggestionIndex == index}
          className={constants.item.className(index)}
          onMouseDown={(event) => props.onSuggectionMouseDown(event)}
          style={constants.item.style(fontSize)}
        >
          {suggestion}
        </li>
      ))}
    </ul>
  );
};
