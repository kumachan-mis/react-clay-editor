import * as React from 'react';

import { Props, State } from './types';
import { EditorConstants } from './constants';
import {
  handleOnMouseDown,
  handleOnMouseMove,
  handleOnMouseUp,
  handleOnMouseLeave,
  handleOnClick,
  handleOnKeyDown,
  handleOnTextChange,
  handleOnTextCut,
  handleOnTextCopy,
  handleOnTextPaste,
  handleOnTextCompositionStart,
  handleOnTextCompositionEnd,
  handleOnSuggectionMouseDown,
} from './utils';
import '../style.css';

import { Cursor } from '../Cursor';
import { Selection } from '../Selection';
import { TextLines } from '../TextLines';

// TODO: use function and hooks
export class Editor extends React.Component<Props, State> {
  private rootRef: React.RefObject<HTMLDivElement>;

  constructor(props: Props) {
    super(props);
    this.state = {
      cursorCoordinate: undefined,
      textAreaValue: '',
      isComposing: false,
      textSelection: undefined,
      selectionWithMouse: 'inactive',
      historyHead: -1,
      editActionHistory: [],
      suggestionType: 'none',
      suggestions: [],
      suggestionIndex: -1,
    };
    this.rootRef = React.createRef<HTMLDivElement>();
  }

  componentDidMount(): void {
    document.addEventListener('mousedown', this.handleOnEditorBlur);
  }

  componentWillUnmount(): void {
    document.removeEventListener('mousedown', this.handleOnEditorBlur);
  }

  render(): React.ReactNode {
    return (
      <div style={this.props.style}>
        <div className={EditorConstants.root.className} ref={this.rootRef}>
          <div
            className={EditorConstants.editor.className}
            onMouseDown={this.createMouseEventHandler(handleOnMouseDown)}
            onMouseMove={this.createMouseEventHandler(handleOnMouseMove)}
            onMouseUp={this.createMouseEventHandler(handleOnMouseUp)}
            onMouseLeave={this.createMouseEventHandler(handleOnMouseLeave)}
            onClick={this.createMouseEventHandler(handleOnClick)}
          >
            <Cursor
              coordinate={this.state.cursorCoordinate}
              textAreaValue={this.state.textAreaValue}
              suggestionType={this.state.suggestionType}
              suggestions={this.state.suggestions}
              suggestionIndex={this.state.suggestionIndex}
              suggestionListDecoration={this.props.decoration?.suggestionList}
              onKeyDown={this.createCursorEventHandlerWithProps(handleOnKeyDown)}
              onTextChange={this.createCursorEventHandlerWithProps(handleOnTextChange)}
              onTextCompositionStart={this.createCursorEventHandler(handleOnTextCompositionStart)}
              onTextCompositionEnd={this.createCursorEventHandler(handleOnTextCompositionEnd)}
              onTextCut={this.createCursorEventHandler(handleOnTextCut)}
              onTextCopy={this.createCursorEventHandler(handleOnTextCopy)}
              onTextPaste={this.createCursorEventHandler(handleOnTextPaste)}
              onSuggectionMouseDown={this.createCursorEventHandler(handleOnSuggectionMouseDown)}
            />
            <Selection textSelection={this.state.textSelection} />
            <TextLines
              text={this.props.text}
              textDecoration={this.props.decoration?.text}
              bracketLinkProps={this.props.bracketLinkProps}
              hashTagProps={this.props.hashTagProps}
              codeProps={this.props.codeProps}
              formulaProps={this.props.formulaProps}
              taggedLinkPropsMap={this.props.taggedLinkPropsMap}
              cursorCoordinate={this.state.cursorCoordinate}
            />
          </div>
        </div>
      </div>
    );
  }

  private createMouseEventHandler = (
    handler: (
      text: string,
      state: State,
      event: React.MouseEvent,
      root: HTMLElement | null
    ) => [string, State]
  ): ((event: React.MouseEvent) => void) => {
    return (event) => {
      if (this.props.disabled || event.button != 0) return;
      const [newText, newState] = handler(this.props.text, this.state, event, this.rootRef.current);
      if (newState != this.state) this.setState(newState);
      if (newText != this.props.text) this.props.onChangeText(newText);
    };
  };

  private createCursorEventHandler = <Event,>(
    handler: (text: string, state: State, event: Event) => [string, State]
  ): ((event: Event) => void) => {
    return (event) => {
      if (this.props.disabled) return;
      const [newText, newState] = handler(this.props.text, this.state, event);
      if (newState != this.state) this.setState(newState);
      if (newText != this.props.text) this.props.onChangeText(newText);
    };
  };

  private createCursorEventHandlerWithProps = <Event,>(
    handler: (text: string, props: Props, state: State, event: Event) => [string, State]
  ): ((event: Event) => void) => {
    return (event) => {
      if (this.props.disabled) return;
      const [newText, newState] = handler(this.props.text, this.props, this.state, event);
      if (newState != this.state) this.setState(newState);
      if (newText != this.props.text) this.props.onChangeText(newText);
    };
  };

  private handleOnEditorBlur = (event: MouseEvent) => {
    if (
      !this.props.disabled &&
      this.state.cursorCoordinate &&
      this.rootRef.current &&
      !this.rootRef.current.contains(event.target as Node)
    ) {
      this.setState({
        ...this.state,
        cursorCoordinate: undefined,
        textAreaValue: '',
        isComposing: false,
        textSelection: undefined,
        selectionWithMouse: 'inactive',
        suggestionType: 'none',
        suggestions: [],
        suggestionIndex: -1,
      });
    }
  };
}
