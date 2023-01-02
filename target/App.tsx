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
import React from 'react';

import 'katex/dist/katex.min.css';

const header = 'React Clay Editor';

const containerClassName = css`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const editorClassName = css`
  && {
    width: 70%;
    height: 70%;
  }
`;

const viewerClassNamme = css`
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
      return <div>React Clay Editor - Test</div>;
    case '/bracket/editor':
    case '/bracket/editor/':
      return <TestTargetEditor syntax="bracket" />;
    case '/bracket/viewer':
    case '/bracket/viewer/':
      return <TestTargetViewer syntax="bracket" />;
    case '/markdown/editor':
    case '/markdown/editor/':
      return <TestTargetEditor syntax="markdown" />;
    case '/markdown/viewer':
    case '/markdown/viewer/':
      return <TestTargetViewer syntax="markdown" />;
    default:
      return <div>404 Not Found</div>;
  }
};

const TestTargetEditor: React.FC<{ syntax: 'bracket' | 'markdown' }> = ({ syntax }) => {
  const [text, setText] = React.useState('');

  return (
    <div className={containerClassName}>
      <EditorRoot
        text={text}
        setText={setText}
        syntax={syntax}
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
    </div>
  );
};

const TestTargetViewer: React.FC<{ syntax: 'bracket' | 'markdown' }> = ({ syntax }) => {
  const [text, setText] = React.useState('');

  return (
    <div className={containerClassName}>
      <textarea
        className={viewerClassNamme}
        value={text}
        onChange={(event) => setText(event.target.value)}
        data-testid="mock-textarea"
      />
      <ViewerRoot
        text={text}
        syntax={syntax}
        textProps={textProps}
        bracketLinkProps={bracketLinkProps}
        hashtagProps={hashtagProps}
        taggedLinkPropsMap={taggedLinkPropsMap}
        className={viewerClassNamme}
      >
        <ViewerTextFieldRoot>
          <ViewerTextFieldBody />
        </ViewerTextFieldRoot>
      </ViewerRoot>
    </div>
  );
};

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
