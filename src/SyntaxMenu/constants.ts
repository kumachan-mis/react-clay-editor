export const SyntaxMenuConstants = {
  section: {
    selectId: 'section-menu',
    items: {
      normal: {
        selectId: 'normal-section-menu-item',
        label: 'normal',
      },
      larger: {
        selectId: 'larger-section-menu-item',
        label: 'larger',
      },
      largest: {
        selectId: 'largest-section-menu-item',
        label: 'largest',
      },
    },
  },
  itemize: {
    selectId: 'itemize-menu',
  },
  bold: {
    selectId: 'bold-menu',
  },
  italic: {
    selectId: 'italic-menu',
  },
  underline: {
    selectId: 'underline-menu',
  },
  bracket: {
    selectId: 'bracket-menu',
  },
  hashtag: {
    selectId: 'hashtag-menu',
  },
  taggedLink: {
    selectId: 'tagged-link-menu',
    items: {
      selectId: (tagName: string) => `${tagName}-tagged-link-menu-item`,
      defaultLabel: (tagName: string) => `"${tagName}" tagged link`,
    },
  },
  code: {
    selectId: 'code-menu',
    items: {
      inline: {
        selectId: 'inline-code-menu-item',
        label: 'inline code',
      },
      block: {
        selectId: 'block-code-menu-item',
        label: 'block code',
      },
    },
  },
  formula: {
    selectId: 'formula-menu',
    items: {
      inline: {
        selectId: 'inline-formula-menu-item',
        label: 'inline formula',
      },
      display: {
        selectId: 'display-formula-menu-item',
        label: 'display formula',
      },
      block: {
        selectId: 'block-formula-menu-item',
        label: 'block code',
      },
    },
  },
  quote: {
    selectId: 'quote-menu',
  },
};
