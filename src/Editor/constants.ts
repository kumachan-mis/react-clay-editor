import styles from './style.css';

export const EditorConstants = {
  root: {
    className: styles.root,
    selectId: 'react-realtime-markup-editor__root',
    selectIdRegex: /react-realtime-markup-editor__root/,
  },
  body: {
    className: styles.body,
    selectId: 'react-realtime-markup-editor__body',
    selectIdRegex: /react-realtime-markup-editor__body/,
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
