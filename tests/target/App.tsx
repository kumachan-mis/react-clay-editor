import React from 'react';

import { Editor } from '../../src';
import { BracketLinkProps, HashtagProps, TaggedLinkProps, TextProps } from '../../src/Editor/types';

import styles from './style.css';

const textProps: TextProps = {
  suggestions: ['React Realtime Markup Editor', 'Document Editor', 'Syntactic', 'Real Time'],
};

const bracketLinkProps: BracketLinkProps = {
  anchorProps: (linkName) => ({
    href: `https://www.npmjs.com/package/${linkName}`,
    target: '_blank',
    rel: 'noopener noreferrer',
  }),
  suggestions: ['react-realtime-markup-editor'],
};

const hashtagProps: HashtagProps = {
  anchorProps: (hashtagName) => ({
    href: `https://www.npmjs.com/package/${hashtagName}`,
    target: '_blank',
    rel: 'noopener noreferrer',
  }),
  suggestions: ['react-realtime-markup-editor'],
};

const taggedLinkPropsMap: { [tag: string]: TaggedLinkProps } = {
  npm: {
    label: 'package',
    anchorProps: (linkName, active) => ({
      className: active ? `${styles.npm} ${styles.active}` : styles.npm,
      href: `https://www.npmjs.com/package/${linkName}`,
      target: '_blank',
      rel: 'noopener noreferrer',
    }),
    suggestions: ['react-realtime-markup-editor'],
  },
  github: {
    linkNameRegex: /@[^[\]]+\/[^[\]]+/,
    label: '@user/repository',
    anchorProps: (linkName, active) => ({
      className: active ? `${styles.github} ${styles.active}` : styles.github,
      href: `https://github.com/${linkName.substring(1)}`,
      target: '_blank',
      rel: 'noopener noreferrer',
    }),
    suggestions: ['@kumachan-mis/react-realtime-markup-editor'],
  },
};

export const App: React.FC = () => {
  const [bracketText, setBracketText] = React.useState('');
  const [markdownText, setMarkdownText] = React.useState('');

  switch (window.location.pathname) {
    case '/':
      return <div>Playwright Test</div>;
    case '/bracket':
    case '/bracket/':
      return (
        <div className={styles.container}>
          <Editor
            text={bracketText}
            onChangeText={setBracketText}
            syntax="bracket"
            textProps={textProps}
            bracketLinkProps={bracketLinkProps}
            hashtagProps={hashtagProps}
            taggedLinkPropsMap={taggedLinkPropsMap}
            className={styles.target}
          />
        </div>
      );
    case '/markdown':
    case '/markdown/':
      return (
        <div className={styles.container}>
          <Editor
            text={markdownText}
            onChangeText={setMarkdownText}
            syntax="markdown"
            textProps={textProps}
            bracketLinkProps={bracketLinkProps}
            hashtagProps={hashtagProps}
            taggedLinkPropsMap={taggedLinkPropsMap}
            className={styles.target}
          />
        </div>
      );
    default:
      return <div>404 Not Found</div>;
  }
};
