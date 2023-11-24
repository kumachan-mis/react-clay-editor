import React from 'react';

export const defaultTextValue = '';

const TextValueContext = React.createContext(defaultTextValue);

export function useTextValueContext(): string {
  return React.useContext(TextValueContext);
}

export const TextValueContextProvider: React.FC<React.PropsWithChildren<{ readonly text: string }>> = ({
  text,
  children,
}) => <TextValueContext.Provider value={text}>{children}</TextValueContext.Provider>;

export const defaultSetText: React.Dispatch<React.SetStateAction<string>> = () => {
  // Do nothing
};

const SetTextContext = React.createContext(defaultSetText);

export function useSetTextContext(): React.Dispatch<React.SetStateAction<string>> {
  return React.useContext(SetTextContext);
}

export function useTextContext(): [string, React.Dispatch<React.SetStateAction<string>>] {
  return [React.useContext(TextValueContext), React.useContext(SetTextContext)];
}

export const TextContextProvider: React.FC<
  React.PropsWithChildren<{ readonly text: string; readonly setText: React.Dispatch<React.SetStateAction<string>> }>
> = ({ text, setText, children }) => (
  <TextValueContext.Provider value={text}>
    <SetTextContext.Provider value={setText}>{children}</SetTextContext.Provider>
  </TextValueContext.Provider>
);
