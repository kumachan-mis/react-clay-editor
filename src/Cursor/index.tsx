import * as React from 'react';

import { Props, State, CursorBarProps, HiddenTextAreaProps, SuggestionListProps } from './types';
import { CursorConstants, defaultSuggestionListDecoration } from './constants';
import { cursorPropsToState, handleOnEditorScroll } from './utils';
import '../style.css';

import { getRoot } from '../Editor/utils';

// TODO: use function and hooks
export class Cursor extends React.Component<Props, State> {
  private rootRef: React.RefObject<HTMLSpanElement>;

  constructor(props: Props) {
    super(props);
    this.state = { position: { top: 0, left: 0 }, cursorSize: 0 };
    this.rootRef = React.createRef<HTMLSpanElement>();
  }

  componentDidMount(): void {
    const editorRoot = this.rootRef.current && getRoot(this.rootRef.current);
    if (!editorRoot) return;
    editorRoot.addEventListener('scroll', this.handleOnEditorScroll);
  }

  componentDidUpdate(prevProps: Readonly<Props>): void {
    if (!this.rootRef.current || this.props == prevProps) return;
    const newState = cursorPropsToState(this.props, this.state, this.rootRef.current);
    if (newState != this.state) this.setState(newState);
  }

  componentWillUnmount(): void {
    const editorRoot = this.rootRef.current && getRoot(this.rootRef.current);
    if (!editorRoot) return;
    editorRoot.removeEventListener('scroll', this.handleOnEditorScroll);
  }

  render(): React.ReactNode {
    return (
      <span ref={this.rootRef}>
        <CursorBar position={this.state.position} cursorSize={this.state.cursorSize} />
        <HiddenTextArea
          textAreaValue={this.props.textAreaValue}
          position={this.state.position}
          cursorSize={this.state.cursorSize}
          onKeyDown={this.props.onKeyDown}
          onTextChange={this.props.onTextChange}
          onTextCut={this.props.onTextCut}
          onTextCopy={this.props.onTextCopy}
          onTextPaste={this.props.onTextPaste}
          onTextCompositionStart={this.props.onTextCompositionStart}
          onTextCompositionEnd={this.props.onTextCompositionEnd}
        />
        <SuggestionList
          suggestionType={this.props.suggestionType}
          suggestions={this.props.suggestions}
          suggestionIndex={this.props.suggestionIndex}
          suggestionListDecoration={this.props.suggestionListDecoration}
          position={this.state.position}
          cursorSize={this.state.cursorSize}
          onSuggectionMouseDown={this.props.onSuggectionMouseDown}
        />
      </span>
    );
  }

  private handleOnEditorScroll = (): void => {
    if (!this.rootRef.current) return;
    const newState = handleOnEditorScroll(this.props, this.state, this.rootRef.current);
    if (newState != this.state) this.setState(newState);
  };
}

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
      {suggestions.map((suggestion, index) => (
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
