import { DARK_THEME, LIGHT_THEME } from '../../../common/constants';
import { EditorProps, EditorPropsContextProvider } from '../../../contexts/EditorPropsContext';
import { EditorStateContextProvider } from '../../../contexts/EditorStateContext';
import { TextContextProvider } from '../../../contexts/TextContext';
import { TextNodesContextProvider } from '../../../contexts/TextNodesContext';
import { Root } from '../../atoms/root/Root';

import { useDocument, useEditorRoot, useScroll } from './hooks';

import { ThemeProvider } from '@emotion/react';
import React from 'react';

export type EditorRootProps = React.PropsWithChildren<
  { text: string; setText: React.Dispatch<React.SetStateAction<string>>; className?: string } & EditorProps
>;

export const EditorRoot: React.FC<EditorRootProps> = ({ text, setText, className, children, ...props }) => (
  <TextContextProvider text={text} setText={setText}>
    <EditorPropsContextProvider props={props}>
      <TextNodesContextProvider text={text} props={props}>
        <EditorStateContextProvider>
          <ThemeProvider theme={props.theme !== 'dark' ? LIGHT_THEME : DARK_THEME}>
            <EditorRootInner className={className}>{children}</EditorRootInner>
          </ThemeProvider>
        </EditorStateContextProvider>
      </TextNodesContextProvider>
    </EditorPropsContextProvider>
  </TextContextProvider>
);

const EditorRootInner: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ className, children }) => {
  const { ref, onMouseDown } = useEditorRoot();

  useDocument(ref);
  useScroll();

  return (
    <Root className={className} ref={ref} onMouseDown={onMouseDown}>
      {children}
    </Root>
  );
};
