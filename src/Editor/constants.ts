import styles from './style.css';

export const EditorConstants = {
  root: {
    className: styles.root,
  },
  editor: {
    className: styles.editor,
  },
  suggestion: {
    bracketLink: {
      facingRegex: /^.*\[(?<linkName>[^[\]]*)$/,
      trailingRegex: /^([\]\s].*)?$/,
    },
    hashtag: {
      facingRegex: /^.*#(?<hashTagName>\S*)$/,
      trailingRegex: /^(\s.*)?$/,
    },
    taggedLink: {
      facingRegex: (tagName: string): RegExp => {
        const tag = tagName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return RegExp(`^.*\\[(?<tag>${tag}:)( (?<linkName>[^[\\]]*))?$`);
      },
      trailingRegex: /^([\]\s].*)?$/,
    },
    decoration: {
      facingRegex: /^.*\[\*{1,3} (?<body>[^[\]]*)$/,
      trailingRegex: /^([\]\s].*)?$/,
    },
    heading: {
      facingRegex: /^#{1,3} (?<body>[^[\]]*)$/,
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
