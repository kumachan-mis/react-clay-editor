import React from 'react';

export type EditorTextValue = string;

export const defaultEditorTextValue: EditorTextValue = '';

const EditorTextValueContext = React.createContext(defaultEditorTextValue);

export function useEditorTextValueContext(): EditorTextValue {
  return React.useContext(EditorTextValueContext);
}

export type SetEditorText = React.Dispatch<React.SetStateAction<EditorTextValue>>;

export const defaultSetEditorText: SetEditorText = () => {
  /* do nothing */
};

const SetEditorTextContext = React.createContext(defaultSetEditorText);

export function useSetEditorTextContext(): SetEditorText {
  return React.useContext(SetEditorTextContext);
}

export type EditorText = [EditorTextValue, SetEditorText];

export function useEditorTextContext(): EditorText {
  return [React.useContext(EditorTextValueContext), React.useContext(SetEditorTextContext)];
}

export const EditorTextContextProvider: React.FC<
  React.PropsWithChildren<{ text: EditorTextValue; setText: SetEditorText }>
> = ({ text, setText, children }) => (
  <EditorTextValueContext.Provider value={text}>
    <SetEditorTextContext.Provider value={setText}>{children}</SetEditorTextContext.Provider>
  </EditorTextValueContext.Provider>
);
