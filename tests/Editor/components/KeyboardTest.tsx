import * as React from 'react';

import { Props as EditorProps, State as EditorState } from '../../../src/Editor/types';
import {
  handleOnKeyDown,
  handleOnTextChange,
  handleOnTextCut,
  handleOnTextCopy,
  handleOnTextPaste,
  handleOnTextCompositionStart,
  handleOnTextCompositionEnd,
} from '../../../src/Editor/callbacks';

export type Props = Omit<EditorProps, 'text' | 'onChangeText'> & {
  initText?: string;
  initState?: EditorState;
};
export { EditorProps, EditorState };
type BodyProps = EditorProps & { initState: EditorState };

export const defaultInitState: EditorState = {
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
  suggestionStart: 0,
};

export const KeyboardTest: React.FC<Props> = ({ initText = '', initState = defaultInitState, ...props }) => {
  const [text, setText] = React.useState(initText);
  return <KeyboardTestBody text={text} onChangeText={setText} initState={initState} {...props} />;
};

const KeyboardTestBody: React.FC<BodyProps> = ({ initState, ...props }) => {
  const [state, setState] = React.useState<EditorState>(initState);

  const createCursorEventHandler = <Event,>(
    handler: (text: string, state: EditorState, event: Event) => [string, EditorState]
  ): ((event: Event) => void) => {
    return (event) => {
      if (props.readonly) return;
      const [newText, newState] = handler(props.text, state, event);
      if (newState != state) setState(newState);
      if (newText != props.text) props.onChangeText(newText);
    };
  };

  const createCursorEventHandlerWithProps = <Event,>(
    handler: (text: string, props: EditorProps, state: EditorState, event: Event) => [string, EditorState]
  ): ((event: Event) => void) => {
    return (event) => {
      if (props.readonly) return;
      const [newText, newState] = handler(props.text, props, state, event);
      if (newState != state) setState(newState);
      if (newText != props.text) props.onChangeText(newText);
    };
  };

  return (
    <>
      {Object.entries({ lines: props.text.split('\n'), ...state }).map(([key, value]) => (
        <div key={key}>
          {key}:{JSON.stringify(value)}
        </div>
      ))}
      <textarea
        value={state.textAreaValue}
        onKeyDown={createCursorEventHandlerWithProps(handleOnKeyDown)}
        onChange={createCursorEventHandlerWithProps(handleOnTextChange)}
        onCut={createCursorEventHandler(handleOnTextCut)}
        onCopy={createCursorEventHandler(handleOnTextCopy)}
        onPaste={createCursorEventHandler(handleOnTextPaste)}
        onCompositionStart={createCursorEventHandler(handleOnTextCompositionStart)}
        onCompositionEnd={createCursorEventHandlerWithProps(handleOnTextCompositionEnd)}
      />
    </>
  );
};
