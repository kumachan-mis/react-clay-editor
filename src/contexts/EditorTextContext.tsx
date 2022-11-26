import React from 'react';

export const defaultEditorTextValue = '';

const EditorTextValueContext = React.createContext(defaultEditorTextValue);

export function useEditorTextValueContext(): string {
  return React.useContext(EditorTextValueContext);
}

export const defaultSetEditorText: React.Dispatch<React.SetStateAction<string>> = () => {
  // do nothing
};

const SetEditorTextContext = React.createContext(defaultSetEditorText);

export function useSetEditorTextContext(): React.Dispatch<React.SetStateAction<string>> {
  return React.useContext(SetEditorTextContext);
}

export function useEditorTextContext(): [string, React.Dispatch<React.SetStateAction<string>>] {
  return [React.useContext(EditorTextValueContext), React.useContext(SetEditorTextContext)];
}

export const EditorTextContextProvider: React.FC<
  React.PropsWithChildren<{ text: string; setText: React.Dispatch<React.SetStateAction<string>> }>
> = ({ text, setText, children }) => (
  <EditorTextValueContext.Provider value={text}>
    <SetEditorTextContext.Provider value={setText}>{children}</SetEditorTextContext.Provider>
  </EditorTextValueContext.Provider>
);
