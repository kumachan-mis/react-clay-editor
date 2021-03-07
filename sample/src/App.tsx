import * as React from 'react';

import { Editor, defaultLinkStyle, defaultLinkOverriddenStyleOnHover } from '../../src';

const defaultMainText = `[*** React Realtime Markup Editor]
A text document editor which is syntactically formattable in real time

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
 hash-tag-link
  #react-realtime-markup-editor
 tagged-link
  [github: @kumachan-mis/react-realtime-markup-editor]
  [npm: react-realtime-markup-editor]

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
>[* Genius is one percent inspiration and ninety-nine percent perspiration]
>by Thomas Edison`;

const defaultSubText = `[** Of course, you can use multiple editors]
[* Links can be disabled]
 bracket-link
  [disabled-bracket-link]
 hash-tag-link
  #disabled-hash-tag-link
 tagged-link
  if you don't define any tag, of course, tagged link is ignored
  [disabled: plain text]

[* Code string can be disabled]
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

[* Math formulas can be disabled]
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

More features are comming soon...`;

const mainStyle: React.CSSProperties = {
  width: 'calc(48vw - 60px)',
  height: 'calc(96vh - 60px)',
  margin: '20px',
  border: 'solid 1px',
  padding: '10px',
  display: 'inline-block',
};
const subStyle: React.CSSProperties = {
  width: 'calc(48vw - 60px)',
  height: 'calc(96vh - 60px)',
  margin: '20px',
  border: 'solid 1px',
  padding: '10px',
  display: 'inline-block',
};

export const App: React.FC = () => {
  const [mainText, setMainText] = React.useState(defaultMainText);
  const [subText, setSubText] = React.useState(defaultSubText);
  return (
    <>
      <Editor
        text={mainText}
        onChangeText={setMainText}
        bracketLinkProps={{
          anchorProps: (linkName) => ({
            href: `https://www.npmjs.com/package/${linkName}`,
            style: defaultLinkStyle,
            overriddenStyleOnHover: defaultLinkOverriddenStyleOnHover,
          }),
        }}
        hashTagProps={{
          anchorProps: (hashTagName) => ({
            href: `https://www.npmjs.com/package/${hashTagName}`,
            style: defaultLinkStyle,
            overriddenStyleOnHover: defaultLinkOverriddenStyleOnHover,
          }),
          suggestions: ['react-realtime-markup-editor'],
        }}
        taggedLinkPropsMap={{
          github: {
            linkNameRegex: /@[^[\]]+\/[^[\]]+/,
            anchorProps: (linkName) => ({
              href: `https://github.com/${linkName.substring(1)}`,
              style: { ...defaultLinkStyle, color: '#595f6E', borderBottom: 'solid 1px' },
              overriddenStyleOnHover: {
                ...defaultLinkOverriddenStyleOnHover,
                color: '#08090B',
                fontWeight: 500,
              },
            }),
            suggestions: ['@kumachan-mis/react-realtime-markup-editor'],
          },
          npm: {
            anchorProps: (linkName) => ({
              href: `https://www.npmjs.com/package/${linkName}`,
              style: { ...defaultLinkStyle, color: '#F75E8A', borderBottom: 'solid 1px' },
              overriddenStyleOnHover: {
                ...defaultLinkOverriddenStyleOnHover,
                color: '#E14978',
                fontWeight: 500,
              },
            }),
            suggestions: ['react-realtime-markup-editor'],
          },
        }}
        style={mainStyle}
      />
      <Editor
        text={subText}
        onChangeText={setSubText}
        bracketLinkProps={{ disabled: true }}
        hashTagProps={{ disabled: true }}
        codeProps={{ disabled: true }}
        formulaProps={{ disabled: true }}
        style={subStyle}
      />
    </>
  );
};
