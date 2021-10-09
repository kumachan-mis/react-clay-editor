import './style.css';

export const EditorConstants = {
  root: {
    className: 'react-realtime-markup-editor',
    selectId: 'react-realtime-markup-editor',
    selectIdRegex: /react-realtime-markup-editor/,
  },
  body: {
    className: 'editor-body',
    selectId: 'editor-body',
    selectIdRegex: /editor-body/,
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
