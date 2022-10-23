import React from 'react';

import { Editor } from '../../src';
import { TextProps, BracketLinkProps, TaggedLinkProps } from '../../src/Editor/types';

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

const taggedLinkPropsMap: { [tagName: string]: TaggedLinkProps } = {
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

  if (window.location.pathname === '/') {
    return <div>Playwright Test</div>;
  } else if (window.location.pathname === '/bracket') {
    return (
      <div className={styles.container}>
        <Editor
          text={bracketText}
          onChangeText={setBracketText}
          syntax="bracket"
          textProps={textProps}
          bracketLinkProps={bracketLinkProps}
          hashtagProps={bracketLinkProps}
          taggedLinkPropsMap={taggedLinkPropsMap}
          className={styles.target}
        />
      </div>
    );
  } else if (window.location.pathname === '/markdown') {
    return (
      <div className={styles.container}>
        <Editor
          text={markdownText}
          onChangeText={setMarkdownText}
          syntax="markdown"
          textProps={textProps}
          bracketLinkProps={bracketLinkProps}
          hashtagProps={bracketLinkProps}
          taggedLinkPropsMap={taggedLinkPropsMap}
          className={styles.target}
        />
      </div>
    );
  }

  return <div>404 Not Found</div>;
};
