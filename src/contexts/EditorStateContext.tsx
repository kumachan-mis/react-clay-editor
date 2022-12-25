import { CursorCoordinate } from 'src/types/cursor/cursorCoordinate';
import { EditAction } from 'src/types/cursor/editAction';
import { CursorSelection } from 'src/types/selection/cursorSelection';

import React from 'react';

export type EditorState = {
  cursorCoordinate: CursorCoordinate | undefined;
  cursorSelection: CursorSelection | undefined;
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

export const defaultEditorStateValue: EditorState = {
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

const EditorStateValueContext = React.createContext(defaultEditorStateValue);

export function useEditorStateValueContext(): EditorState {
  return React.useContext(EditorStateValueContext);
}

export const defaultSetEditorState: React.Dispatch<React.SetStateAction<EditorState>> = () => {
  // do nothing
};

const SetEditorStateContext = React.createContext(defaultSetEditorState);

export function useSetEditorStateContext(): React.Dispatch<React.SetStateAction<EditorState>> {
  return React.useContext(SetEditorStateContext);
}

export function useEditorStateContext(): [EditorState, React.Dispatch<React.SetStateAction<EditorState>>] {
  return [React.useContext(EditorStateValueContext), React.useContext(SetEditorStateContext)];
}

export const EditorStateContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, setState] = React.useState(defaultEditorStateValue);
  return (
    <EditorStateValueContext.Provider value={state}>
      <SetEditorStateContext.Provider value={setState}>{children}</SetEditorStateContext.Provider>
    </EditorStateValueContext.Provider>
  );
};
