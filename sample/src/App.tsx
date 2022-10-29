import React from 'react';

import { Editor } from '../../src';
import { BracketLinkProps, HashtagProps, TaggedLinkProps, TextProps } from '../../src/Editor/types';

import styles from './style.css';

const header = 'React Realtime Markup Editor';

// prettier-ignore
const defaultBracketText =
`A text document editor which is syntactically formattable in real time
[/ bracket-based syntax]

[** Itemizations]
 You can use itemizations
 by just typing a space
 like this
  You can also use nested itemizations
  by just typing multiple spaces
  like this

[** Shortcut commands]
 select all
 cut
 copy
 paste
 undo
 redo
 move up
 move down
 move left
 move right
 move to word top
 move to word bottom
 move to line top
 move to line bottom
 move to text top
 move to text bottom

[** Text decorations]
 [* bold]
 [/ italic]
 [_ underline]

You can combine these text decorations
 [*/ bold italic]
 [*_ bold underline]
and so on

[** Links]
 bracket-link
  [react-realtime-markup-editor]
 hashtag-link
  #react-realtime-markup-editor
 tagged-link
  [github: @kumachan-mis/react-realtime-markup-editor]
  [npm: react-realtime-markup-editor]
 url
  https://www.npmjs.com/package/react-realtime-markup-editor
  https://github.com/kumachan-mis/react-realtime-markup-editor

[** Code strings]
 inline mode
  \`import { Editor } from 'react-realtime-markup-editor'\`
 block mode
  \`\`\`
  import { Editor } from 'react-realtime-markup-editor';
  const App: React.FC = () => {
    const [text, setText] = React.useState('');
    return <Editor text={text} onChangeText={setText} />;
  };
  // note: code block is not a bulleted item
  \`\`\`

[** Math formulas]
 inline mode
  $f(x)$
 display mode
  $$\\int_a^b f(x) \\mathrm{d}x$$
 block mode
  $$
  A =
  \\left(
  \\begin{matrix}
    a_{11} & a_{12} & \\cdots & a_{1n} \\\\
    a_{21} & a_{22} & \\cdots & a_{2n} \\\\
    \\vdots & \\vdots & \\ddots & \\vdots \\\\
    a_{m1} & a_{m2} & \\cdots & a_{mn} \\\\
  \\end{matrix}
  \\right)
  $$

[** Quatations]
> Genius is one percent inspiration and ninety-nine percent perspiration
> by Thomas Edison`;

// prettier-ignore
const defaultMarkdownText =
`A text document editor which is syntactically formattable in real time
_markdown-like syntax_

## Itemizations
- You can use itemizations
- by just typing a \`-\` or \`*\`
- like this
 * You can also use nested itemizations
 * by just typing spaces
 * like this

## Shortcut commands
- select all
- cut
- copy
- paste
- undo
- redo
- move up
- move down
- move left
- move right
- move to word top
- move to word bottom
- move to line top
- move to line bottom
- move to text top
- move to text bottom

## Text decorations
- *bold*
- _italic_

combination of text decorations is not supported yet

## Links
- bracket-link
 - [react-realtime-markup-editor]
- hashtag-link
 - #react-realtime-markup-editor
- tagged-link
 - [github: @kumachan-mis/react-realtime-markup-editor]
 - [npm: react-realtime-markup-editor]
- url
 - https://www.npmjs.com/package/react-realtime-markup-editor
 - https://github.com/kumachan-mis/react-realtime-markup-editor

## Code strings
- inline mode
 - \`import { Editor } from 'react-realtime-markup-editor'\`
- block mode
  \`\`\`
  import { Editor } from 'react-realtime-markup-editor';
  const App: React.FC = () => {
    const [text, setText] = React.useState('');
    return <Editor text={text} onChangeText={setText} />;
  };
  // note: code block is not a bulleted item
  \`\`\`

## Math formulas
- inline mode
 - $f(x)$
- display mode
 - $$\\int_a^b f(x) \\mathrm{d}x$$
- block mode
  $$
  A =
  \\left(
  \\begin{matrix}
    a_{11} & a_{12} & \\cdots & a_{1n} \\\\
    a_{21} & a_{22} & \\cdots & a_{2n} \\\\
    \\vdots & \\vdots & \\ddots & \\vdots \\\\
    a_{m1} & a_{m2} & \\cdots & a_{mn} \\\\
  \\end{matrix}
  \\right)
  $$

## Quatations
> Genius is one percent inspiration and ninety-nine percent perspiration
> by Thomas Edison`;

const textProps: TextProps = {
  header,
  suggestions: ['React Realtime Markup Editor', 'Document Editor', 'Syntactic', 'Real Time'],
};

const bracketLinkProps: BracketLinkProps = {
  anchorProps: (linkName) => ({
    href: `https://www.npmjs.com/package/${linkName}`,
    target: '_blank',
    rel: 'noopener noreferrer',
  }),
  suggestions: ['react-realtime-markup-editor'],
};

const hashtagProps: HashtagProps = {
  anchorProps: (hashtagName) => ({
    href: `https://www.npmjs.com/package/${hashtagName}`,
    target: '_blank',
    rel: 'noopener noreferrer',
  }),
  suggestions: ['react-realtime-markup-editor'],
};

const taggedLinkPropsMap: { [tag: string]: TaggedLinkProps } = {
  npm: {
    label: 'package',
    anchorProps: (linkName, active) => ({
      className: active ? `${styles.npm} ${styles.active}` : styles.npm,
      href: `https://www.npmjs.com/package/${linkName}`,
      target: '_blank',
      rel: 'noopener noreferrer',
    }),
    suggestions: ['react-realtime-markup-editor'],
  },
  github: {
    linkNameRegex: /@[^[\]]+\/[^[\]]+/,
    label: '@user/repository',
    anchorProps: (linkName, active) => ({
      className: active ? `${styles.github} ${styles.active}` : styles.github,
      href: `https://github.com/${linkName.substring(1)}`,
      target: '_blank',
      rel: 'noopener noreferrer',
    }),
    suggestions: ['@kumachan-mis/react-realtime-markup-editor'],
  },
};

export const App: React.FC = () => {
  const [bracketText, setBracketText] = React.useState(defaultBracketText);
  const [markdownText, setMarkdownText] = React.useState(defaultMarkdownText);

  return (
    <>
      <Editor
        text={bracketText}
        onChangeText={setBracketText}
        syntax="bracket"
        textProps={textProps}
        bracketLinkProps={bracketLinkProps}
        hashtagProps={hashtagProps}
        taggedLinkPropsMap={taggedLinkPropsMap}
        className={styles.sample}
      />
      <Editor
        text={markdownText}
        onChangeText={setMarkdownText}
        syntax="markdown"
        textProps={textProps}
        bracketLinkProps={bracketLinkProps}
        hashtagProps={hashtagProps}
        taggedLinkPropsMap={taggedLinkPropsMap}
        className={styles.sample}
      />
    </>
  );
};
