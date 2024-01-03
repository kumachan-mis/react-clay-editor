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
  suggestions: ['react-clay-editor', 'katex', '@emotion/react', '@emotion/styled', 'react'],
};

const taggedLinkPropsMap: Record<string, EditorTaggedLinkProps> = {
  npm: {
    label: 'package',
    anchorProps: (linkName) => ({
      className: css`
        && {
          color: #f75e8a;
          border-bottom: solid 1px;

          &[data-clickable='true'] {
            color: #f75e8a;
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
            color: #595f6e;
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

const TestTargetEditorPage: React.FC<{ readonly syntax: 'bracket' | 'markdown'; readonly theme: 'light' | 'dark' }> = ({
  syntax,
  theme,
}) => {
  const [text, setText] = React.useState('');
  const [key, setKey] = React.useState(0);

  return (
    <Container themeName={theme}>
      <EditorRoot
        bracketLinkProps={bracketLinkProps}
        className={editorClassName}
        hashtagProps={hashtagProps}
        key={key}
        setText={setText}
        syntax={syntax}
        taggedLinkPropsMap={taggedLinkPropsMap}
        text={text}
        textProps={textProps}
        theme={theme}
      >
        <EditorSyntaxMenu />
        <Divider />
        <EditorTextFieldRoot>
          <EditorHeader header={header} />
          <EditorTextFieldBody />
        </EditorTextFieldRoot>
        <MockLines text={text} />
      </EditorRoot>
      <RefreshButton
        data-testid="refresh-button"
        onClick={() => {
          setText('');
          setKey((key) => key + 1); // Force re-mount
        }}
        themeName={theme}
      >
        Refresh
      </RefreshButton>
    </Container>
  );
};

const TestTargetViewerPage: React.FC<{ readonly syntax: 'bracket' | 'markdown'; readonly theme: 'light' | 'dark' }> = ({
  syntax,
  theme,
}) => {
  const [text, setText] = React.useState('');
  const [key, setKey] = React.useState(0);

  return (
    <Container themeName={theme}>
      <TextArea
        data-testid="mock-textarea"
        onChange={(event) => {
          setText(event.target.value);
        }}
        themeName={theme}
        value={text}
      />
      <ViewerRoot
        bracketLinkProps={bracketLinkProps}
        className={viewerClassName}
        hashtagProps={hashtagProps}
        key={key}
        syntax={syntax}
        taggedLinkPropsMap={taggedLinkPropsMap}
        text={text}
        textProps={textProps}
        theme={theme}
      >
        <ViewerTextFieldRoot>
          <ViewerTextFieldBody />
        </ViewerTextFieldRoot>
      </ViewerRoot>
      <RefreshButton
        data-testid="refresh-button"
        onClick={() => {
          setText('');
          setKey((key) => key + 1); // Force re-mount
        }}
        themeName={theme}
      >
        Refresh
      </RefreshButton>
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
  background-color: ${props.themeName !== 'dark' ? 'rgba(243, 246, 249, 1.0)' : 'rgba(24, 24, 24, 1.0)'};
`
);

const RefreshButton = styled.button<{ themeName: 'light' | 'dark' }>(
  (props) => `
  position: absolute;
  top: 36px;
  left: 36px;
  cursor: pointer;
  padding: 8px 16px;
  color: ${props.themeName !== 'dark' ? 'rgba(16, 20, 24, 0.87)' : 'rgba(243, 246, 249, 1.0)'};
  background-color: transparent;
  &:hover {
    background-color: ${props.themeName !== 'dark' ? 'rgba(243, 246, 249, 0.08)' : 'rgba(16, 20, 24, 0.04)'};
  }
`
);

const TextArea = styled.textarea<{ themeName: 'light' | 'dark' }>(
  (props) => `
  width: 35%;
  height: 70%;
  margin: 5px;
  color: ${props.themeName !== 'dark' ? 'rgba(16, 20, 24, 0.87)' : 'rgba(243, 246, 249, 1.0)'};
  background-color: ${props.themeName !== 'dark' ? 'rgba(243, 246, 249, 1.0)' : 'rgba(24, 24, 24, 1.0)'};
  border-color: ${props.themeName !== 'dark' ? 'rgba(16, 20, 24, 0.12)' : 'rgba(243, 246, 249, 0.12)'};
`
);

const MockLines: React.FC<{ readonly text: string }> = ({ text }) => (
  <div
    className={css`
      height: 0px;
      overflow: hidden;
    `}
  >
    {text.split('\n').map((line, i) => (
      <div data-testid={`mock-L${i}`} key={i}>
        {line}
      </div>
    ))}
  </div>
);

const NotFoundPage: React.FC = () => <div>404 Not Found</div>;
