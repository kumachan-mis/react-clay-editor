import React from 'react';

import styles from './style.css';

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
          <input data-selectid="editor-body" value={bracketText} onChange={(e) => setBracketText(e.target.value)} />
        </div>
      );
    case '/markdown':
    case '/markdown/':
      return (
        <div className={styles.container}>
          <input data-selectid="editor-body" value={markdownText} onChange={(e) => setMarkdownText(e.target.value)} />
        </div>
      );
    default:
      return <div>404 Not Found</div>;
  }
};
