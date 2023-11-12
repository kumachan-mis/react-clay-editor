import {
  Divider,
  EditorBracketLinkProps,
  EditorHashtagProps,
  EditorHeader,
  EditorRoot,
  EditorSyntaxMenu,
  EditorTaggedLinkProps,
  EditorTextFieldBody,
  EditorTextFieldRoot,
  EditorTextProps,
  ViewerRoot,
  ViewerTextFieldBody,
  ViewerTextFieldRoot,
} from '../src';

import { css } from '@emotion/css';
import styled from '@emotion/styled';
import React from 'react';

import 'katex/dist/katex.min.css';

const header = 'React Clay Editor';

const editorClassName = css`
  && {
    width: 70%;
    height: 70%;
  }
`;

const viewerClassName = css`
  && {
    width: 35%;
    height: 70%;
    margin: 5px;
  }
`;

const textProps: EditorTextProps = {
  suggestions: ['React Clay Editor', 'Document Editor', 'Syntactic', 'Real Time'],
};

const bracketLinkProps: EditorBracketLinkProps = {
  anchorProps: (linkName) => ({
    href: `https://www.npmjs.com/package/${linkName}`,
    target: '_blank',
    rel: 'noopener noreferrer',
  }),
  suggestions: ['react-clay-editor', 'katex', '@emotion/react', '@emotion/styled', 'react'],
};

const hashtagProps: EditorHashtagProps = {
  anchorProps: (hashtagName) => ({
    href: `https://www.npmjs.com/package/${hashtagName}`,
    target: '_blank',
    rel: 'noopener noreferrer',
  }),
  suggestions: ['react-clay-editor', 'katex', 'react'],
};

const taggedLinkPropsMap: { [tag: string]: EditorTaggedLinkProps } = {
  npm: {
    label: 'package',
    anchorProps: (linkName) => ({
      className: css`
        && {
          color: #f75e8a;
          border-bottom: solid 1px;

          &[data-clickable='true'] {
            color: #e14978;
            font-weight: 500;
          }
        }
      `,
      href: `https://www.npmjs.com/package/${linkName}`,
      target: '_blank',
      rel: 'noopener noreferrer',
    }),
    suggestions: ['react-clay-editor', 'katex', '@emotion/react', '@emotion/styled', 'react'],
  },
  github: {
    linkNameRegex: /@[^[\]]+\/[^[\]]+/,
    label: '@user/repository',
    anchorProps: (linkName) => ({
      className: css`
        && {
          color: #595f6e;
          border-bottom: solid 1px;

          &[data-clickable='true'] {
            color: #08090b;
            font-weight: 500;
          }
        }
      `,
      href: `https://github.com/${linkName.substring(1)}`,
      target: '_blank',
      rel: 'noopener noreferrer',
    }),
    suggestions: ['@kumachan-mis/react-clay-editor', '@KaTeX/KaTeX', '@emotion-js/emotion', '@facebook/react'],
  },
};

export const App: React.FC = () => {
  switch (window.location.pathname) {
    case '/':
      return <RootPage />;
    case '/bracket/editor':
    case '/bracket/editor/':
      return <TestTargetEditorPage syntax="bracket" theme="light" />;
    case '/bracket/viewer':
    case '/bracket/viewer/':
      return <TestTargetViewerPage syntax="bracket" theme="light" />;
    case '/markdown/editor':
    case '/markdown/editor/':
      return <TestTargetEditorPage syntax="markdown" theme="dark" />;
    case '/markdown/viewer':
    case '/markdown/viewer/':
      return <TestTargetViewerPage syntax="markdown" theme="dark" />;
    default:
      return <NotFoundPage />;
  }
};

const RootPage: React.FC = () => (
  <div>
    <div>React Clay Editor - Test</div>
    <ul>
      <li>
        <a href="/bracket/editor">Bracket Editor</a>
      </li>
      <li>
        <a href="/bracket/viewer">Bracket Viewer</a>
      </li>
      <li>
        <a href="/markdown/editor">Markdown Editor</a>
      </li>
      <li>
        <a href="/markdown/viewer">Markdown Viewer</a>
      </li>
    </ul>
  </div>
);

const TestTargetEditorPage: React.FC<{ syntax: 'bracket' | 'markdown'; theme: 'light' | 'dark' }> = ({
  syntax,
  theme,
}) => {
  const [text, setText] = React.useState('');
  const [key, setKey] = React.useState(0);

  return (
    <Container themeName={theme}>
      <EditorRoot
        key={key}
        text={text}
        setText={setText}
        syntax={syntax}
        theme={theme}
        textProps={textProps}
        bracketLinkProps={bracketLinkProps}
        hashtagProps={hashtagProps}
        taggedLinkPropsMap={taggedLinkPropsMap}
        className={editorClassName}
      >
        <EditorSyntaxMenu />
        <Divider />
        <EditorTextFieldRoot>
          <EditorHeader header={header} />
          <EditorTextFieldBody />
        </EditorTextFieldRoot>
        <MockLines text={text} />
      </EditorRoot>
      <RefreshButtonClassName
        themeName={theme}
        onClick={() => {
          setText('');
          setKey((key) => key + 1); // force re-mount
        }}
        data-testid="refresh-button"
      >
        Refresh
      </RefreshButtonClassName>
    </Container>
  );
};

const TestTargetViewerPage: React.FC<{ syntax: 'bracket' | 'markdown'; theme: 'light' | 'dark' }> = ({
  syntax,
  theme,
}) => {
  const [text, setText] = React.useState('');
  const [key, setKey] = React.useState(0);

  return (
    <Container themeName={theme}>
      <TextArea
        themeName={theme}
        value={text}
        onChange={(event) => setText(event.target.value)}
        data-testid="mock-textarea"
      />
      <ViewerRoot
        key={key}
        text={text}
        syntax={syntax}
        theme={theme}
        textProps={textProps}
        bracketLinkProps={bracketLinkProps}
        hashtagProps={hashtagProps}
        taggedLinkPropsMap={taggedLinkPropsMap}
        className={viewerClassName}
      >
        <ViewerTextFieldRoot>
          <ViewerTextFieldBody />
        </ViewerTextFieldRoot>
      </ViewerRoot>
      <RefreshButtonClassName
        themeName={theme}
        onClick={() => {
          setText('');
          setKey((key) => key + 1); // force re-mount
        }}
        data-testid="refresh-button"
      >
        Refresh
      </RefreshButtonClassName>
    </Container>
  );
};

const Container = styled.div<{ themeName: 'light' | 'dark' }>(
  (props) => `
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background-color: ${props.themeName !== 'dark' ? 'rgba(255, 255, 255, 1.0)' : 'rgba(24, 24, 24, 1.0)'};
`
);

const RefreshButtonClassName = styled.button<{ themeName: 'light' | 'dark' }>(
  (props) => `
  position: absolute;
  top: 36px;
  left: 36px;
  cursor: pointer;
  padding: 8px 16px;
  color: ${props.themeName !== 'dark' ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 1.0)'};
  background-color: ${props.themeName !== 'dark' ? 'rgba(255, 255, 255, 0)' : 'rgba(0, 0, 0, 0.0)'};
  &:hover {
    background-color: ${props.themeName !== 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'};
  }
`
);

const TextArea = styled.textarea<{ themeName: 'light' | 'dark' }>(
  (props) => `
  width: 35%;
  height: 70%;
  margin: 5px;
  color: ${props.themeName !== 'dark' ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 1.0)'};
  background-color: ${props.themeName !== 'dark' ? 'rgba(255, 255, 255, 1.0)' : 'rgba(18, 18, 18, 1.0)'};
  border-color: ${props.themeName !== 'dark' ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)'};
`
);

const MockLines: React.FC<{ text: string }> = ({ text }) => (
  <div
    className={css`
      height: 0px;
      overflow: hidden;
    `}
  >
    {text.split('\n').map((line, i) => (
      <div key={i} data-testid={`mock-L${i}`}>
        {line}
      </div>
    ))}
  </div>
);

const NotFoundPage: React.FC = () => <div>404 Not Found</div>;
