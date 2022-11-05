import styles from './style.css';

export const EditorConstants = {
  root: {
    className: styles.root,
    selectId: 'editor-root',
  },
  editor: {
    className: styles.editor,
    selectId: 'editor',
    testId: 'editor',
    style: (hideSyntaxMenu?: boolean): React.CSSProperties =>
      hideSyntaxMenu ? { height: '100%' } : { height: 'calc(100% - 36px)' },
  },
  body: {
    className: styles.body,
    selectId: 'editor-body',
    selectIdRegex: /editor-body/,
    testId: 'editor-body',
  },
  syntaxMenu: {
    className: styles.syntaxMenu,
  },
  suggestion: {
    bracketLink: {
      facingRegex: /^.*\[(?<text>[^[\]]*)$/,
      trailingRegex: /^([\]\s].*)?$/,
    },
    hashtag: {
      facingRegex: /^.*#(?<text>\S*)$/,
      trailingRegex: /^(\s.*)?$/,
    },
    taggedLink: {
      facingRegex: (tagName: string): RegExp => {
        const tag = tagName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return RegExp(`^.*\\[(?<tag>${tag}:)( (?<text>[^[\\]]*))?$`);
      },
      trailingRegex: /^([\]\s].*)?$/,
    },
    decoration: {
      facingRegex: /^.*\[\*{1,3} (?<text>[^[\]]*)$/,
      trailingRegex: /^([\]\s].*)?$/,
    },
    heading: {
      facingRegex: /^#{1,3} (?<text>[^[\]]*)$/,
      trailingRegex: /^([\]\s].*)?$/,
    },
    text: {
      facingRegex: /^(.*\s)?(?<text>\S+)$/,
      trailingRegex: /^(\s.*)?$/,
    },
  },
  history: {
    maxLength: 50,
  },
};
