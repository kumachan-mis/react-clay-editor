import * as React from "react";

import { Props, State, CursorBarProps, HiddenTextAreaProps, SuggestionListProps } from "./types";
import { CursorConstants } from "./constants";
import { cursorPropsToState } from "./utils";
import "../style.css";

export const Cursor: React.FC<Props> = (props) => {
  const [state, setState] = React.useState<State>({ position: { top: 0, left: 0 }, cursorSize: 0 });
  const rootRef = React.useRef<HTMLSpanElement | null>(null);

  React.useEffect(() => {
    if (!rootRef.current) return;
    const newState = cursorPropsToState(props, state, rootRef.current);
    if (newState != state) setState(newState);
  }, [props]);

  return (
    <span ref={rootRef}>
      <CursorBar {...state} />
      <HiddenTextArea {...state} {...props} />
      <SuggestionList {...state} {...props} />
    </span>
  );
};

const CursorBar: React.FC<CursorBarProps> = (props) => (
  <div
    className={CursorConstants.rootDiv.className}
    style={CursorConstants.rootDiv.style(props.position, props.cursorSize)}
  >
    <svg width={CursorConstants.svg.width} height={props.cursorSize}>
      <rect
        x={CursorConstants.rect.x}
        y={CursorConstants.rect.y}
        width={CursorConstants.rect.width}
        height={CursorConstants.rect.height}
      />
    </svg>
  </div>
);

const HiddenTextArea: React.FC<HiddenTextAreaProps> = (props) => {
  const constants = CursorConstants.textArea;
  const textLength = props.textAreaValue.length;
  return (
    <textarea
      className={constants.className}
      value={props.textAreaValue}
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
      style={constants.style(props.position, props.cursorSize, textLength)}
    />
  );
};

const SuggestionList: React.FC<SuggestionListProps> = (props) => {
  const constants = CursorConstants.suggestion;
  const { width, maxHeight, fontSize } = props.suggestionListDecoration;
  const hidden = props.suggestions.length == 0;
  return (
    <ul
      className={constants.list.className}
      style={constants.list.style(props.position, props.cursorSize, width, maxHeight, hidden)}
    >
      {props.suggestions.map((suggestion: string, index: number) => (
        <li
          key={index}
          aria-selected={props.suggestionIndex == index}
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
