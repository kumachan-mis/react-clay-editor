import * as React from 'react';

import { Props, State } from '../../src/Editor/types';
import {
  handleOnKeyDown,
  handleOnTextChange,
  handleOnTextCut,
  handleOnTextCopy,
  handleOnTextPaste,
  handleOnTextCompositionStart,
  handleOnTextCompositionEnd,
} from '../../src/Editor/utils';

export const TextareaTester: React.FC<Props> = (props: Props) => {
  const [state, setState] = React.useState<State>({
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
  });

  const createCursorEventHandler = <Event,>(
    handler: (text: string, state: State, event: Event) => [string, State]
  ): ((event: Event) => void) => {
    return (event) => {
      if (props.disabled) return;
      const [newText, newState] = handler(props.text, state, event);
      if (newState != state) setState(newState);
      if (newText != props.text) props.onChangeText(newText);
    };
  };

  const createCursorEventHandlerWithProps = <Event,>(
    handler: (text: string, props: Props, state: State, event: Event) => [string, State]
  ): ((event: Event) => void) => {
    return (event) => {
      if (props.disabled) return;
      const [newText, newState] = handler(props.text, props, state, event);
      if (newState != state) setState(newState);
      if (newText != props.text) props.onChangeText(newText);
    };
  };

  return (
    <textarea
      onKeyDown={createCursorEventHandlerWithProps(handleOnKeyDown)}
      onChange={createCursorEventHandlerWithProps(handleOnTextChange)}
      onCut={createCursorEventHandler(handleOnTextCut)}
      onCopy={createCursorEventHandler(handleOnTextCopy)}
      onPaste={createCursorEventHandler(handleOnTextPaste)}
      onCompositionStart={createCursorEventHandler(handleOnTextCompositionStart)}
      onCompositionEnd={createCursorEventHandler(handleOnTextCompositionEnd)}
    />
  );
};
