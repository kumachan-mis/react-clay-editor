import {
  Divider,
  EditorHeader,
  EditorRoot,
  EditorSyntaxMenu,
  EditorTextFieldBody,
  EditorTextFieldRoot,
} from '../../src';

import { css } from '@emotion/css';
import { Meta } from '@storybook/react';
import React from 'react';

const meta: Meta = {
  component: React.Fragment,
};

export default meta;

export const SimpleEditorStory: React.FC = () => {
  const [text, setText] = React.useState('This is a simple editor.');
  return (
    <EditorRoot setText={setText} text={text} theme="dark">
      <EditorTextFieldRoot>
        <EditorTextFieldBody />
      </EditorTextFieldRoot>
    </EditorRoot>
  );
};

export const FullwidthStory: React.FC = () => {
  const [text, setText] = React.useState(
    ['This is a full-width editor.', '`className` is available to overwrite the default styling.'].join('\n')
  );
  return (
    <EditorRoot
      className={css`
        && {
          width: 100%;
        }
      `}
      setText={setText}
      text={text}
      theme="dark"
    >
      <EditorTextFieldRoot>
        <EditorTextFieldBody />
      </EditorTextFieldRoot>
    </EditorRoot>
  );
};

export const WithSyntaxMenuStory: React.FC = () => {
  const [text, setText] = React.useState(
    [
      'This is an editor with the syntax menu.',
      'The syntax menu helps users who are not familiar with syntactic writing.',
    ].join('\n')
  );
  return (
    <EditorRoot setText={setText} text={text} theme="dark">
      <EditorSyntaxMenu />
      <Divider />
      <EditorTextFieldRoot>
        <EditorTextFieldBody />
      </EditorTextFieldRoot>
    </EditorRoot>
  );
};

export const WithFixedHeaderStory: React.FC = () => {
  const [text, setText] = React.useState(
    [
      'This is an editor with the header in a fixed area.',
      'The header is useful to show a fixed title of a document.',
    ].join('\n')
  );
  return (
    <EditorRoot setText={setText} text={text} theme="dark">
      <EditorHeader header="Header in Fixed Area" />
      <EditorTextFieldRoot>
        <EditorTextFieldBody />
      </EditorTextFieldRoot>
    </EditorRoot>
  );
};

export const WithScrollableHeaderStory: React.FC = () => {
  const [text, setText] = React.useState(
    [
      'This is an editor with the header in a scrollable area.',
      'The header is useful to show a fixed title of a document.',
    ].join('\n')
  );
  return (
    <EditorRoot setText={setText} text={text} theme="dark">
      <EditorTextFieldRoot>
        <EditorHeader header="Header in Scrollable Area" />
        <EditorTextFieldBody />
      </EditorTextFieldRoot>
    </EditorRoot>
  );
};

export const WithUserDefinedFooterStory: React.FC = () => {
  const [text, setText] = React.useState(
    ['This is an editor with an user-defined footer.', 'You can customize the editor as you like.'].join('\n')
  );
  return (
    <EditorRoot setText={setText} text={text} theme="dark">
      <EditorTextFieldRoot>
        <EditorTextFieldBody />
      </EditorTextFieldRoot>
      <Divider />
      <div style={{ textAlign: 'end', fontSize: '0.7rem', color: 'rgba(16, 20, 24, 0.4)' }}>
        React Clay Editor: a document editor quick editable and flexible like clay in hands
      </div>
    </EditorRoot>
  );
};
