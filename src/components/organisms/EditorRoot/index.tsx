import { EditorProps, EditorPropsContextProvider } from '../../../contexts/EditorPropsContext';
import { EditorStateContextProvider } from '../../../contexts/EditorStateContext';
import { TextContextProvider } from '../../../contexts/TextContext';
import { TextNodesContextProvider } from '../../../contexts/TextNodesContext';
import { Root } from '../../atoms/root/Root';

import { useDocument, useEditorRoot, useScroll } from './hooks';

import React from 'react';

export type EditorRootProps = React.PropsWithChildren<
  { text: string; setText: React.Dispatch<React.SetStateAction<string>> } & EditorProps
>;

export const EditorRoot: React.FC<EditorRootProps> = ({ text, setText, children, ...props }) => (
  <TextContextProvider text={text} setText={setText}>
    <EditorPropsContextProvider props={props}>
      <TextNodesContextProvider text={text} props={props}>
        <EditorStateContextProvider>
          <EditorRootInner className={props.className}>{children}</EditorRootInner>
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
