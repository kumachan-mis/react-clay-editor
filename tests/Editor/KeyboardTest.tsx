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

export const defaultInitState: State = {
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

export type KeyboardTestProps = Omit<Props, 'text' | 'onChangeText'> & {
  initText?: string;
  initState?: State;
};

export { State as KeyboardTestState };

export const KeyboardTest: React.FC<KeyboardTestProps> = ({
  initText = '',
  initState = defaultInitState,
  ...props
}) => {
  const [text, setText] = React.useState(initText);
  return <KeyboardTestBody text={text} onChangeText={setText} initState={initState} {...props} />;
};

const KeyboardTestBody: React.FC<Props & { initState: State }> = ({ initState, ...props }) => {
  const [state, setState] = React.useState<State>(initState);

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
        onCompositionEnd={createCursorEventHandler(handleOnTextCompositionEnd)}
      />
    </>
  );
};
