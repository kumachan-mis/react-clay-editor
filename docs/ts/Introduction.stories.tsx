import {
  Divider,
  EditorBracketLinkProps,
  EditorHashtagProps,
  EditorHeader,
  EditorRoot,
  EditorSyntaxMenu,
  EditorTaggedLinkProps,
  EditorTextFieldBody,
  EditorTextFieldRoot,
  EditorTextProps,
} from '../../src';

import { css } from '@emotion/css';
import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

// prettier-ignore
const initialText =
`A document editor quick editable and flexible like clay in hands

[** Itemization]
 itemizations
  nested itemizations

[** Bold, Italic and Underline]
 This is [* bold text]
 This is [/ italic text]
 This is [_ underlined text]

[** Link]
 bracket link
  [react-clay-editor]
 hashtag
  #react-clay-editor
 tagged link
  [github: @kumachan-mis/react-clay-editor]
  [npm: react-clay-editor]
 url
  https://www.npmjs.com/package/react-clay-editor
  https://github.com/kumachan-mis/react-clay-editor

[** Code String]
 inline mode
  \`import { EditorRoot } from 'react-clay-editor'\`
 block mode
  \`\`\`
  const App: React.FC = () => {
    const [text, setText] = React.useState('');
    return (
      <EditorRoot text={text} setText={setText}>
        <EditorTextFieldRoot>
          <EditorTextFieldBody />
        </EditorTextFieldRoot>
      </EditorRoot>
    );
  };
  \`\`\`

[** Math Formula]
 inline mode
  $x = r \\cos \\theta, y = r \\sin \\theta$
 display mode
  $$\\int_a^b f(x) \\mathrm{d}x$$
 block mode
  $$
  A =
  \\begin{pmatrix}
  a_{11} & a_{12} & \\cdots & a_{1n} \\\\
  a_{21} & a_{22} & \\cdots & a_{2n} \\\\
  \\vdots & \\vdots & \\ddots & \\vdots \\\\
  a_{m1} & a_{m2} & \\cdots & a_{mn} \\\\
  \\end{pmatrix}
  $$

[** Quotation]
> quotation
 > nested quotation`;

const editorClassName = css`
  && {
    width: 100%;
    height: 450px;
  }
`;

const textProps: EditorTextProps = {
  suggestions: ['React Clay Editor', 'Document Editor', 'Syntactic', 'Real Time'],
};

const bracketLinkProps: EditorBracketLinkProps = {
  anchorProps: (linkName) => ({
    href: `https://www.npmjs.com/package/${linkName}`,
    target: '_blank',
    rel: 'noopener noreferrer',
  }),
  suggestions: ['react-clay-editor', 'katex', '@emotion/react', '@emotion/styled', 'react'],
};

const hashtagProps: EditorHashtagProps = {
  anchorProps: (hashtagName) => ({
    href: `https://www.npmjs.com/package/${hashtagName}`,
    target: '_blank',
    rel: 'noopener noreferrer',
  }),
  suggestions: ['react-clay-editor', 'katex', '@emotion/react', '@emotion/styled', 'react'],
};

const taggedLinkPropsMap: { [tag: string]: EditorTaggedLinkProps } = {
  npm: {
    label: 'package',
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
    suggestions: ['react-clay-editor', 'katex', '@emotion/react', '@emotion/styled', 'react'],
  },
  github: {
    linkNameRegex: /@[^[\]]+\/[^[\]]+/,
    label: '@user/repository',
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
    suggestions: ['@kumachan-mis/react-clay-editor', '@KaTeX/KaTeX', '@emotion-js/emotion', '@facebook/react'],
  },
};

const Introduction: React.FC = () => {
  const [text, setText] = React.useState(initialText);
  return (
    <EditorRoot
      theme="dark"
      text={text}
      setText={setText}
      textProps={textProps}
      bracketLinkProps={bracketLinkProps}
      hashtagProps={hashtagProps}
      taggedLinkPropsMap={taggedLinkPropsMap}
      className={editorClassName}
    >
      <EditorSyntaxMenu />
      <Divider />
      <EditorTextFieldRoot>
        <EditorHeader header="React Clay Editor" />
        <EditorTextFieldBody />
      </EditorTextFieldRoot>
    </EditorRoot>
  );
};

const meta: Meta<typeof Introduction> = {
  component: Introduction,
};

export default meta;

type Story = StoryObj<typeof Introduction>;

export const IntroductionStory: Story = {};
