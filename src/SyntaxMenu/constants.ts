export const SectionMenuConstants = {
  selectId: 'section-menu',
  items: {
    normal: {
      defaultLabel: 'normal',
      selectId: 'normal-section-menu-item',
    },
    larger: {
      defaultLabel: 'larger',
      selectId: 'larger-section-menu-item',
    },
    largest: {
      defaultLabel: 'largest',
      selectId: 'largest-section-menu-item',
    },
  },
};

export const ItemizationMenuConstants = {
  selectId: 'itemization-menu',
  items: {
    indent: {
      defaultLabel: 'indent',
      selectId: 'indent-itemization-menu-item',
    },
    outdent: {
      defaultLabel: 'outdent',
      selectId: 'outdent-itemization-menu-item',
    },
  },
};

export const BoldMenuConstants = {
  selectId: 'bold-menu',
};

export const ItalicMenuConstants = {
  selectId: 'italic-menu',
};

export const UnderlineMenuConstants = {
  selectId: 'underline-menu',
};

export const BracketMenuConstants = {
  selectId: 'bracket-menu',
  defaultLabel: 'bracket link',
};

export const HashtagMenuConstants = {
  selectId: 'hashtag-menu',
  defaultLabel: 'hashtag link',
};

export const TaggedLinkMenuConstants = {
  selectId: 'tagged-link-menu',
  items: {
    defaultLabel: 'tagged link',
    taggedLabel: (tagName: string, label: string) => `${tagName}: ${label}`,
    selectId: (tagName: string) => `${tagName}-tagged-link-menu-item`,
  },
};

export const CodeMenuConstants = {
  selectId: 'code-menu',
  items: {
    inline: {
      defaultLabel: 'inline code',
      selectId: 'inline-code-menu-item',
    },
    block: {
      defaultLabel: 'block code',
      selectId: 'block-code-menu-item',
    },
  },
};

export const FormulaMenuConstants = {
  selectId: 'formula-menu',
  items: {
    inline: {
      defaultLabel: 'inline formula',
      selectId: 'inline-formula-menu-item',
    },
    display: {
      defaultLabel: 'display formula',
      selectId: 'display-formula-menu-item',
    },
    block: {
      defaultLabel: 'block formula',
      selectId: 'block-formula-menu-item',
    },
  },
};

export const QuotationMenuConstants = {
  selectId: 'quotation-menu',
  items: {
    indent: {
      defaultLabel: 'indent',
      selectId: 'indent-quotation-menu-item',
    },
    outdent: {
      defaultLabel: 'outdent',
      selectId: 'outdent-quotation-menu-item',
    },
  },
};
