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
  {
    readonly text: string;
    readonly setText: React.Dispatch<React.SetStateAction<string>>;
    readonly className?: string;
  } & EditorProps
>;

export const EditorRoot: React.FC<EditorRootProps> = ({ text, setText, className, children, ...props }) => (
  <TextContextProvider setText={setText} text={text}>
    <EditorPropsContextProvider props={props}>
      <TextNodesContextProvider props={props} text={text}>
        <EditorStateContextProvider>
          <ThemeProvider theme={props.theme !== 'dark' ? LIGHT_THEME : DARK_THEME}>
            <EditorRootInner className={className}>{children}</EditorRootInner>
          </ThemeProvider>
        </EditorStateContextProvider>
      </TextNodesContextProvider>
    </EditorPropsContextProvider>
  </TextContextProvider>
);

const EditorRootInner: React.FC<React.PropsWithChildren<{ readonly className?: string }>> = ({
  className,
  children,
}) => {
  const { ref, onMouseDown } = useEditorRoot();

  useDocument(ref);
  useScroll();

  return (
    <Root className={className} onMouseDown={onMouseDown} ref={ref}>
      {children}
    </Root>
  );
};
