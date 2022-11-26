import React from 'react';

import { EditorProps, EditorPropsContextProvider } from '../../../contexts/EditorPropsContext';
import { EditorStateContextProvider } from '../../../contexts/EditorStateContext';
import { EditorTextContextProvider } from '../../../contexts/EditorTextContext';
import { EditorTextNodesContextProvider } from '../../../contexts/EditorTextNodesContext';
import { EditorRoot as Atom } from '../../atoms/editor/EditorRoot';

import { useDocument, useEditorRoot, useScroll } from './hooks';

export type EditorRootProps = React.PropsWithChildren<
  { text: string; setText: React.Dispatch<React.SetStateAction<string>> } & EditorProps
>;

export const EditorRoot: React.FC<EditorRootProps> = ({ text, setText, children, ...props }) => (
  <EditorTextContextProvider text={text} setText={setText}>
    <EditorPropsContextProvider props={props}>
      <EditorTextNodesContextProvider text={text} props={props}>
        <EditorStateContextProvider>
          <EditorRootInner className={props.className}>{children}</EditorRootInner>
        </EditorStateContextProvider>
      </EditorTextNodesContextProvider>
    </EditorPropsContextProvider>
  </EditorTextContextProvider>
);

const EditorRootInner: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ className, children }) => {
  const { ref, onMouseDown } = useEditorRoot();

  useDocument(ref);
  useScroll();

  return (
    <Atom className={className} ref={ref} onMouseDown={onMouseDown}>
      {children}
    </Atom>
  );
};
