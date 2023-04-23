import { ViewerRoot, ViewerTextFieldBody, ViewerHeader, ViewerTextFieldRoot } from '../../src';

import { css } from '@emotion/css';
import { Meta } from '@storybook/react';
import React from 'react';

const meta: Meta = {
  component: React.Fragment,
};

export default meta;

export const SimpleViewerStory: React.FC = () => (
  <ViewerRoot text="This is a simple viewer.">
    <ViewerTextFieldRoot>
      <ViewerTextFieldBody />
    </ViewerTextFieldRoot>
  </ViewerRoot>
);

export const FullwidthStory: React.FC = () => (
  <ViewerRoot
    text={['This is a full-width viewer.', '`className` is available to overwrite the default styling.'].join('\n')}
    className={css`
      && {
        width: 100%;
      }
    `}
  >
    <ViewerTextFieldRoot>
      <ViewerTextFieldBody />
    </ViewerTextFieldRoot>
  </ViewerRoot>
);

export const WithFixedHeaderStory: React.FC = () => (
  <ViewerRoot
    text={[
      'This is a viewer with the header in a fixed area.',
      'The header is useful to show a fixed title of a document.',
    ].join('\n')}
  >
    <ViewerHeader header="Header in Fixed Area" />
    <ViewerTextFieldRoot>
      <ViewerTextFieldBody />
    </ViewerTextFieldRoot>
  </ViewerRoot>
);

export const WithScrollableHeaderStory: React.FC = () => (
  <ViewerRoot
    text={[
      'This is a viewer with the header in a scrollable area.',
      'The header is useful to show a fixed title of a document.',
    ].join('\n')}
  >
    <ViewerTextFieldRoot>
      <ViewerHeader header="Header in Scrollable Area" />
      <ViewerTextFieldBody />
    </ViewerTextFieldRoot>
  </ViewerRoot>
);

export const DualPanedEditorStory: React.FC = () => {
  const [text, setText] = React.useState(
    [
      '# Dual-Paned Editor',
      'You can implement a dual-paned editor by using the viewer and the standard `<textarea>`.',
    ].join('\n')
  );
  return (
    <div
      className={css`
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      `}
    >
      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        className={css`
          && {
            width: 45%;
            height: 400px;
            margin: 5px;
          }
        `}
      />
      <ViewerRoot
        text={text}
        syntax="markdown"
        className={css`
          && {
            width: 45%;
            height: 400px;
            margin: 5px;
          }
        `}
      >
        <ViewerTextFieldRoot>
          <ViewerTextFieldBody />
        </ViewerTextFieldRoot>
      </ViewerRoot>
    </div>
  );
};
