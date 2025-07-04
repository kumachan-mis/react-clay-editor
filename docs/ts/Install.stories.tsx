import { EditorRoot, EditorTextFieldBody, EditorTextFieldRoot } from '../../src';

import { Meta } from '@storybook/react-vite';
import React from 'react';

const meta: Meta = {
  component: React.Fragment,
};

export default meta;

export const InstallStory: React.FC & { toSourceCode: () => string } = () => {
  const [text, setText] = React.useState(
    [
      '[* Simple Usage]',
      ' import the following components',
      '  `EditorRoot`',
      '  `EditorTextFieldRoot`',
      '  `EditorTextFieldBody`',
      ' create nested commponent with them',
      ' give `text` and `setText` to `EditorRoot`',
    ].join('\n'),
  );
  return (
    <EditorRoot palette="dark" setText={setText} text={text}>
      <EditorTextFieldRoot>
        <EditorTextFieldBody />
      </EditorTextFieldRoot>
    </EditorRoot>
  );
};

InstallStory.toSourceCode = () => `() => {
  const [text, setText] = React.useState(
    [
      '[* Simple Usage]',
      ' import the following components',
      '  \`EditorRoot\`',
      '  \`EditorTextFieldRoot\`',
      '  \`EditorTextFieldBody\`',
      ' create nested commponent with them',
      ' give \`text\` and \`setText\` to \`EditorRoot\`',
    ].join('\\n'),
  );
  return (
    <EditorRoot palette="dark" setText={setText} text={text}>
      <EditorTextFieldRoot>
        <EditorTextFieldBody />
      </EditorTextFieldRoot>
    </EditorRoot>
  );
};`;
