import { css } from '@emotion/css';
import React from 'react';

import { EditorRoot } from '../../src/components/organisms/EditorRoot';
import { EditorSyntaxMenu } from '../../src/components/organisms/EditorSyntaxMenu';
import { EditorTextFieldBody } from '../../src/components/organisms/EditorTextFieldBody';
import { EditorTextFieldHeader } from '../../src/components/organisms/EditorTextFieldHeader';
import { EditorTextFieldRoot } from '../../src/components/organisms/EditorTextFieldRoot';
import { BracketLinkProps, HashtagProps, TaggedLinkProps, TextProps } from '../../src/contexts/EditorPropsContext';

const header = 'React Realtime Markup Editor';

const className = css`
  && {
    width: 70%;
    height: 70%;
    border: solid 1px;
    padding: 5px;
  }
`;

const containerClassName = css`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const textProps: TextProps = {
  suggestions: ['React Realtime Markup Editor', 'Document Editor', 'Syntactic', 'Real Time'],
};

const bracketLinkProps: BracketLinkProps = {
  anchorProps: (linkName) => ({
    href: `https://www.npmjs.com/package/${linkName}`,
    target: '_blank',
    rel: 'noopener noreferrer',
  }),
  suggestions: ['react-realtime-markup-editor', 'katex', '@emotion/react', '@emotion/styled', 'react'],
};

const hashtagProps: HashtagProps = {
  anchorProps: (hashtagName) => ({
    href: `https://www.npmjs.com/package/${hashtagName}`,
    target: '_blank',
    rel: 'noopener noreferrer',
  }),
  suggestions: ['react-realtime-markup-editor', 'katex', '@emotion/react', '@emotion/styled', 'react'],
};

const taggedLinkPropsMap: { [tag: string]: TaggedLinkProps } = {
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
    suggestions: ['react-realtime-markup-editor', 'katex', '@emotion/react', '@emotion/styled', 'react'],
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
    suggestions: [
      '@kumachan-mis/react-realtime-markup-editor',
      '@KaTeX/KaTeX',
      '@emotion-js/emotion',
      '@facebook/react',
    ],
  },
};

export const App: React.FC = () => {
  switch (window.location.pathname) {
    case '/':
      return <div>Playwright Test</div>;
    case '/bracket':
    case '/bracket/':
      return <TestTargetEditor syntax="bracket" />;
    case '/markdown':
    case '/markdown/':
      return <TestTargetEditor syntax="markdown" />;
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
        className={className}
      >
        <EditorSyntaxMenu />
        <EditorTextFieldRoot>
          <EditorTextFieldHeader header={header} />
          <EditorTextFieldBody />
        </EditorTextFieldRoot>
        <MockLines text={text} />
      </EditorRoot>
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
