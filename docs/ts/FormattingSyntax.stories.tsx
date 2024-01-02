import { ViewerRoot, ViewerRootProps, ViewerTextFieldBody, ViewerTextFieldRoot } from '../../src';

import { css } from '@emotion/css';
import { linkTo } from '@storybook/addon-links';
import { Meta, StoryObj } from '@storybook/react';

const FormattingSyntax: React.FC<ViewerRootProps> = (props) => (
  <ViewerRoot
    className={css`
      && {
        border: none;
        height: auto;
      }
    `}
    theme="dark"
    {...props}
  >
    <ViewerTextFieldRoot>
      <ViewerTextFieldBody />
    </ViewerTextFieldRoot>
  </ViewerRoot>
);

const meta: Meta<typeof FormattingSyntax> = {
  component: FormattingSyntax,
};

export default meta;

type Story = StoryObj<typeof FormattingSyntax>;

export const BracketItemization: Story = {
  args: {
    syntax: 'bracket',
    text: [' itemization', '  nested itemization'].join('\n'),
  },
};

export const MarkdownItemization: Story = {
  args: {
    syntax: 'markdown',
    text: [
      '* asterisk itemization',
      '- hyphen itemization',
      ' * nested asterisk itemization',
      ' - nested hyphen itemization',
    ].join('\n'),
  },
};

export const BracketDecoration: Story = {
  args: {
    syntax: 'bracket',
    text: [
      '[*** Largest Heading]',
      '[** Larger Heading]',
      '[* Normal Heading]',
      'This is [* bold text]',
      'This is [/ italic text]',
      'This is [_ underlined text]',
    ].join('\n'),
  },
};

export const BracketCombinedDecoration: Story = {
  args: {
    syntax: 'bracket',
    text: [
      'This is [*/ bold italic text]',
      'This is [/_ italic underlined text]',
      'This is [_* underlined bold text]',
    ].join('\n'),
  },
};

export const MarkdownDecoration: Story = {
  args: {
    syntax: 'markdown',
    text: [
      '# Largest Heading',
      '## Larger Heading',
      '### Normal Heading',
      'This is *bold text*',
      'This is _italic text_',
    ].join('\n'),
  },
};

export const MarkdownCombinedDecoration: Story = {
  args: {
    syntax: 'markdown',
    text: ['This is *_bold italic_*', 'This is _*italic bold*_'].join('\n'),
  },
};

export const BracketLink: Story = {
  args: { text: '[bracket link]' },
};

export const ConfiguredBracketLink: Story = {
  args: {
    text: ['[get-started-introduction]', '[api-overview]'].join('\n'),
    bracketLinkProps: { anchorProps: (linkName) => ({ onClick: linkTo(linkName) }) },
  },
};

export const Hashtag: Story = {
  args: { text: '#hashtag' },
};

export const ConfiguredHashtag: Story = {
  args: {
    text: ['#get-started-introduction', '#api-overview'].join('\n'),
    hashtagProps: { anchorProps: (linkName) => ({ onClick: linkTo(linkName) }) },
  },
};

export const TaggedLink: Story = {
  args: {
    text: ['[npm: react-clay-editor]', '[github: @kumachan-mis/react-clay-editor]'].join('\n'),
    taggedLinkPropsMap: {
      npm: {
        anchorProps: (linkName) => ({
          className: css`
            && {
              color: #f75e8a;
              border-bottom: solid 1px;
              &[data-clickable='true'] {
                color: #f75e8a;
                font-weight: 500;
              }
            }
          `,
          href: `https://www.npmjs.com/package/${linkName}`,
          target: '_blank',
          rel: 'noopener noreferrer',
        }),
      },
      github: {
        linkNameRegex: /@[^[\]]+\/[^[\]]+/,
        anchorProps: (linkName) => ({
          className: css`
            && {
              color: #595f6e;
              border-bottom: solid 1px;
              &[data-clickable='true'] {
                color: #595f6e;
                font-weight: 500;
              }
            }
          `,
          href: `https://github.com/${linkName.substring(1)}`,
          target: '_blank',
          rel: 'noopener noreferrer',
        }),
      },
    },
  },
};

export const CodeString: Story = {
  args: {
    text: [
      'inline code',
      "`import React from 'react';`",
      '',
      'block code',
      '```',
      'const App: React.FC = () => {',
      "  const [text, setText] = React.useState('');",
      '  return (',
      '    <EditorRoot text={text} setText={setText}>',
      '      <EditorTextFieldRoot>',
      '        <EditorTextFieldBody />',
      '      </EditorTextFieldRoot>',
      '    </EditorRoot>',
      '  );',
      '};',
      '```',
    ].join('\n'),
  },
};

export const MathFormula: Story = {
  args: {
    text: [
      'inline math formula',
      '$x = r \\cos \\theta, y = r \\sin \\theta$',
      '',
      'display math formula',
      '$$I = \\int_a^b f(x) \\mathrm{d}x$$',
      '',
      'block math formula',
      '$$',
      'A = \\begin{pmatrix}',
      'a_{11}  & a_{12}  & \\cdots & a_{1n}  \\\\',
      'a_{21}  & a_{22}  & \\cdots & a_{2n}  \\\\',
      '\\vdots & \\vdots & \\ddots & \\vdots \\\\',
      'a_{m1}, & a_{m2}  & \\cdots & a_{mn}  \\\\',
      '\\end{pmatrix}',
      '$$',
    ].join('\n'),
  },
};

export const Quotation: Story = {
  args: { text: ['> quotation', ' > nested itemization'].join('\n') },
};
