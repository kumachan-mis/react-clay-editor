import { Root } from 'src/components/atoms/root/Root';
import { EditorProps, EditorPropsContextProvider } from 'src/contexts/EditorPropsContext';
import { EditorStateContextProvider } from 'src/contexts/EditorStateContext';
import { TextContextProvider } from 'src/contexts/TextContext';
import { TextNodesContextProvider } from 'src/contexts/TextNodesContext';

import { useEditorRoot, useDocument, useScroll } from './hooks';

import React from 'react';

export type EditorRootProps = React.PropsWithChildren<
  { text: string; setText: React.Dispatch<React.SetStateAction<string>>; className?: string } & EditorProps
>;

export const EditorRoot: React.FC<EditorRootProps> = ({ text, setText, className, children, ...props }) => (
  <TextContextProvider text={text} setText={setText}>
    <EditorPropsContextProvider props={props}>
      <TextNodesContextProvider text={text} props={props}>
        <EditorStateContextProvider>
          <EditorRootInner className={className}>{children}</EditorRootInner>
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
