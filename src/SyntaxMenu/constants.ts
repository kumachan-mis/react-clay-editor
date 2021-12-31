export const SyntaxMenuConstants = {
  section: {
    testId: 'section-menu',
    items: {
      normal: {
        defaultLabel: 'normal',
        testId: 'normal-section-menu-item',
      },
      larger: {
        defaultLabel: 'larger',
        testId: 'larger-section-menu-item',
      },
      largest: {
        defaultLabel: 'largest',
        testId: 'largest-section-menu-item',
      },
    },
  },
  itemization: {
    testId: 'itemization-menu',
    items: {
      indent: {
        defaultLabel: 'indent',
        testId: 'indent-itemization-menu-item',
      },
      outdent: {
        defaultLabel: 'outdent',
        testId: 'outdent-itemization-menu-item',
      },
    },
  },
  bold: {
    testId: 'bold-menu',
  },
  italic: {
    testId: 'italic-menu',
  },
  underline: {
    testId: 'underline-menu',
  },
  bracket: {
    testId: 'bracket-menu',
  },
  hashtag: {
    testId: 'hashtag-menu',
  },
  taggedLink: {
    testId: 'tagged-link-menu',
    items: {
      defaultLabel: (tagName: string) => `"${tagName}" tagged link`,
      testId: (tagName: string) => `${tagName}-tagged-link-menu-item`,
    },
  },
  code: {
    testId: 'code-menu',
    items: {
      inline: {
        defaultLabel: 'inline code',
        testId: 'inline-code-menu-item',
      },
      block: {
        defaultLabel: 'block code',
        testId: 'block-code-menu-item',
      },
    },
  },
  formula: {
    testId: 'formula-menu',
    items: {
      inline: {
        defaultLabel: 'inline formula',
        testId: 'inline-formula-menu-item',
      },
      display: {
        defaultLabel: 'display formula',
        testId: 'display-formula-menu-item',
      },
      block: {
        defaultLabel: 'block code',
        testId: 'block-formula-menu-item',
      },
    },
  },
  quotation: {
    testId: 'quotation-menu',
    items: {
      indent: {
        defaultLabel: 'indent',
        testId: 'indent-quotation-menu-item',
      },
      outdent: {
        defaultLabel: 'outdent',
        testId: 'outdent-quotation-menu-item',
      },
    },
  },
};
