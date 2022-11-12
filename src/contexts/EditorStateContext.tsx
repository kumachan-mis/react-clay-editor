import React from 'react';

import { CursorCoordinate } from '../types/cursorCoordinate';
import { CursorSelection } from '../types/cursorSelection';
import { EditAction } from '../types/editAction';

export type EditorStateValue = {
  cursorCoordinate: CursorCoordinate | null;
  cursorSelection: CursorSelection | null;
  cursorScroll: 'none' | 'fired' | 'pause' | 'up' | 'down';
  textAreaValue: string;
  textComposing: boolean;
  editActionHistoryHead: number;
  editActionHistory: EditAction[];
  suggestionType: 'none' | 'text' | 'bracketLink' | 'hashtag' | 'taggedLink';
  suggestions: string[];
  suggestionIndex: number;
  suggestionStart: number;
};

export const defaultEditorStateValue: EditorStateValue = {
  cursorCoordinate: null,
  cursorSelection: null,
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

const EditorStateValueContext = React.createContext(defaultEditorStateValue);

export function useEditorStateValueContext(): EditorStateValue {
  return React.useContext(EditorStateValueContext);
}

export type SetEditorState = React.Dispatch<React.SetStateAction<EditorStateValue>>;

export const defaultSetEditorState: SetEditorState = () => {
  /* do nothing */
};

const SetEditorStateContext = React.createContext(defaultSetEditorState);

export function useSetEditorStateContext(): SetEditorState {
  return React.useContext(SetEditorStateContext);
}

export type EditorState = [EditorStateValue, SetEditorState];

export function useEditorStateContext(): EditorState {
  return [React.useContext(EditorStateValueContext), React.useContext(SetEditorStateContext)];
}

export const EditorStateContextProvider: React.FC<
  React.PropsWithChildren<{ text: EditorStateValue; setText: SetEditorState }>
> = ({ text, setText, children }) => (
  <EditorStateValueContext.Provider value={text}>
    <SetEditorStateContext.Provider value={setText}>{children}</SetEditorStateContext.Provider>
  </EditorStateValueContext.Provider>
);
