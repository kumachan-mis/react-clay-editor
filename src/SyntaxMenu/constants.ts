export const SectionMenuConstants = {
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
};

export const ItemizationMenuConstants = {
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
};

export const BoldMenuConstants = {
  testId: 'bold-menu',
};

export const ItalicMenuConstants = {
  testId: 'italic-menu',
};

export const UnderlineMenuConstants = {
  testId: 'underline-menu',
};

export const BracketMenuConstants = {
  testId: 'bracket-menu',
  defaultLabel: 'bracket link',
};

export const HashtagMenuConstants = {
  testId: 'hashtag-menu',
  defaultLabel: 'hashtag link',
};

export const TaggedLinkMenuConstants = {
  testId: 'tagged-link-menu',
  defaultLabel: 'tagged link',
  items: {
    label: (tagName: string) => `"${tagName}" tagged link`,
    testId: (tagName: string) => `${tagName}-tagged-link-menu-item`,
  },
};

export const CodeMenuConstants = {
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
};

export const FormulaMenuConstants = {
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
      defaultLabel: 'block formula',
      testId: 'block-formula-menu-item',
    },
  },
};

export const QuotationMenuConstants = {
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
};
