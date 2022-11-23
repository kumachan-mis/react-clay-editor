import React from 'react';

import {
  BracketLinkParsing,
  HashtagParsing,
  TaggedLinkParsing,
  CodeParsing,
  FormulaParsing,
} from '../../../common/types';
import { ParsingOptions, parseText } from '../../../parser';
import { BlockNode } from '../../../parser/block/types';
import { LineNode } from '../../../parser/line/types';
import { createTaggedLinkRegex } from '../../../parser/taggedLink/parseTaggedLink';

import {
  handleOnKeyDown,
  handleOnTextChange,
  handleOnTextCut,
  handleOnTextCopy,
  handleOnTextPaste,
  handleOnTextCompositionStart,
  handleOnTextCompositionEnd,
  handleOnSuggectionMouseDown,
} from './callbacks/keyboard';
import {
  handleOnMouseDown,
  handleOnMouseMove,
  handleOnMouseUp,
  handleOnClick,
  handleOnMouseScrollUp,
  handleOnMouseScrollDown,
} from './callbacks/mouse';
import { EditorProps, EditorState } from './types';

const defaultState: EditorState = {
  cursorCoordinate: undefined,
  cursorSelection: undefined,
  cursorScroll: 'none',
  textAreaValue: '',
  textComposing: false,
  editActionHistoryHead: -1,
  editActionHistory: [],
  suggestionType: 'none',
  suggestions: [],
  suggestionIndex: -1,
  suggestionStart: 0,
};

export function useEditorState(
  props: EditorProps,
  ref: React.MutableRefObject<HTMLDivElement | null>
): {
  state: EditorState;
  setState: React.Dispatch<React.SetStateAction<EditorState>>;
} {
  const [state, setState] = React.useState<EditorState>(defaultState);

  const handleOnDocumentMouseDown = React.useCallback(() => {
    setState((state) => ({
      ...defaultState,
      editActionHistory: state.editActionHistory,
      editActionHistoryHead: state.editActionHistoryHead,
    }));
  }, [setState]);

  const handleOnDocumentMouseMove = React.useCallback(
    (event: MouseEvent) => {
      if (event.button !== 0) return;
      setState((state) => handleOnMouseMove(props.text, state, event, ref.current));
    },
    [setState, props.text, ref]
  );

  const handleOnDocumentMouseUp = React.useCallback(
    (event: MouseEvent) => {
      if (event.button !== 0) return;
      setState((state) => handleOnMouseUp(props.text, state, event, ref.current));
    },
    [setState, props.text, ref]
  );

  React.useEffect(() => {
    document.addEventListener('mousedown', handleOnDocumentMouseDown);
    return () => {
      document.removeEventListener('mousedown', handleOnDocumentMouseDown);
    };
  }, [handleOnDocumentMouseDown]);

  React.useEffect(() => {
    document.addEventListener('mousemove', handleOnDocumentMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleOnDocumentMouseMove);
    };
  }, [handleOnDocumentMouseMove]);

  React.useEffect(() => {
    document.addEventListener('mouseup', handleOnDocumentMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleOnDocumentMouseUp);
    };
  }, [handleOnDocumentMouseUp]);

  return { state, setState };
}

export function useEditorRootEventHandlers(ref: React.MutableRefObject<HTMLDivElement | null>): {
  onMouseDown: React.MouseEventHandler<HTMLDivElement>;
} {
  const handleOnDocumentMouseUpTemporary = React.useCallback(() => {
    ref.current?.querySelector('textarea')?.focus({ preventScroll: true });
  }, [ref]);

  const handleOnTextFieldRootMouseDown = React.useCallback(
    (event: React.MouseEvent) => {
      document.addEventListener('mouseup', handleOnDocumentMouseUpTemporary);
      event.nativeEvent.stopPropagation();
    },
    [handleOnDocumentMouseUpTemporary]
  );

  return { onMouseDown: handleOnTextFieldRootMouseDown };
}

export function useTextFieldBodyEventHandlers(
  props: EditorProps,
  setState: React.Dispatch<React.SetStateAction<EditorState>>,
  ref: React.MutableRefObject<HTMLDivElement | null>
): {
  onMouseDown: React.MouseEventHandler<HTMLDivElement>;
  onClick: React.MouseEventHandler<HTMLDivElement>;
} {
  const handleOnTextFieldBodyMouseDown = React.useCallback(
    (event: React.MouseEvent) => {
      if (event.button !== 0) return;
      setState((state) => handleOnMouseDown(props.text, state, event, ref.current));
    },
    [setState, props.text, ref]
  );

  const handleOnTextFieldBodyClick = React.useCallback(
    (event: React.MouseEvent) => {
      if (event.button !== 0) return;
      setState((state) => handleOnClick(props.text, state, event, ref.current));
    },
    [setState, props.text, ref]
  );

  return { onMouseDown: handleOnTextFieldBodyMouseDown, onClick: handleOnTextFieldBodyClick };
}

export function useCursorEventHandlers(
  props: EditorProps,
  state: EditorState,
  setState: React.Dispatch<React.SetStateAction<EditorState>>
): {
  onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onTextChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onTextCut: (event: React.ClipboardEvent<HTMLTextAreaElement>) => void;
  onTextCopy: (event: React.ClipboardEvent<HTMLTextAreaElement>) => void;
  onTextPaste: (event: React.ClipboardEvent<HTMLTextAreaElement>) => void;
  onTextCompositionStart: (event: React.CompositionEvent<HTMLTextAreaElement>) => void;
  onTextCompositionEnd: (event: React.CompositionEvent<HTMLTextAreaElement>) => void;
  onSuggectionMouseDown: (event: React.MouseEvent<HTMLLIElement>) => void;
} {
  const createEventHandler = React.useCallback(
    <Event>(
      handler: (text: string, state: EditorState, event: Event) => [string, EditorState]
    ): ((event: Event) => void) => {
      return (event) => {
        const [newText, newState] = handler(props.text, state, event);
        setState(newState);
        props.onChangeText(newText);
      };
    },
    [props, state, setState]
  );

  const createEventHandlerWithProps = React.useCallback(
    <Event>(
      handler: (text: string, props: EditorProps, state: EditorState, event: Event) => [string, EditorState]
    ): ((event: Event) => void) => {
      return (event) => {
        const [newText, newState] = handler(props.text, props, state, event);
        setState(newState);
        props.onChangeText(newText);
      };
    },
    [props, state, setState]
  );

  return {
    onKeyDown: createEventHandlerWithProps(handleOnKeyDown),
    onTextChange: createEventHandlerWithProps(handleOnTextChange),
    onTextCompositionStart: createEventHandler(handleOnTextCompositionStart),
    onTextCompositionEnd: createEventHandlerWithProps(handleOnTextCompositionEnd),
    onTextCut: createEventHandler(handleOnTextCut),
    onTextCopy: createEventHandler(handleOnTextCopy),
    onTextPaste: createEventHandler(handleOnTextPaste),
    onSuggectionMouseDown: createEventHandler(handleOnSuggectionMouseDown),
  };
}

export function useScroll(
  text: string,
  cursorScroll: 'none' | 'fired' | 'pause' | 'up' | 'down',
  setState: React.Dispatch<React.SetStateAction<EditorState>>
): void {
  const timeIdRef = React.useRef<number>(0);

  React.useEffect(() => {
    switch (cursorScroll) {
      case 'up':
        if (timeIdRef.current) break;
        timeIdRef.current = window.setInterval(() => {
          setState((state) => handleOnMouseScrollUp(text, state));
        });
        break;
      case 'down':
        if (timeIdRef.current) break;
        timeIdRef.current = window.setInterval(() => {
          setState((state) => handleOnMouseScrollDown(text, state));
        });
        break;
      default:
        if (timeIdRef.current) window.clearInterval(timeIdRef.current);
        timeIdRef.current = 0;
        break;
    }

    return () => {
      if (timeIdRef.current) window.clearInterval(timeIdRef.current);
      timeIdRef.current = 0;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursorScroll]);
}

export function useParser(
  text: string,
  syntax?: 'bracket' | 'markdown',
  bracketLinkParsing?: BracketLinkParsing,
  hashtagParsing?: HashtagParsing,
  taggedLinkParsingMap?: { [tagName: string]: TaggedLinkParsing },
  codeParsing?: CodeParsing,
  formulaParsing?: FormulaParsing
): (BlockNode | LineNode)[] {
  const nodes = React.useMemo(() => {
    const options: ParsingOptions = {
      syntax,
      bracketLinkDisabled: bracketLinkParsing?.disabled,
      hashtagDisabled: hashtagParsing?.disabled,
      codeDisabled: codeParsing?.disabled,
      formulaDisabled: formulaParsing?.disabled,
      taggedLinkRegexes: Object.entries(taggedLinkParsingMap || {}).map(([tagName, linkParsing]) =>
        createTaggedLinkRegex(tagName, linkParsing.linkNameRegex)
      ),
    };
    return parseText(text, options);
  }, [
    text,
    syntax,
    bracketLinkParsing?.disabled,
    hashtagParsing?.disabled,
    codeParsing?.disabled,
    formulaParsing?.disabled,
    taggedLinkParsingMap,
  ]);

  return nodes;
}
