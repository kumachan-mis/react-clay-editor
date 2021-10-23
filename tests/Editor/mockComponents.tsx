import * as React from 'react';
import { Editor, EditorProps } from '../../src';

export type MockEditorProps = Omit<EditorProps, 'text' | 'onChangeText'> & { initText?: string };

export const MockEditor: React.FC<MockEditorProps> = ({ initText = '', ...props }) => {
  const [text, setText] = React.useState(initText);
  return <Editor text={text} onChangeText={setText} {...props} />;
};

export type MockTextLinesProps = { text: string };

export const MockTextLines: React.FC<MockTextLinesProps> = ({ text }) => {
  return (
    <div>
      {text.split('\n').map((line, i) => (
        <div key={i} data-testid={`mock-line-${i}`}>
          {line}
        </div>
      ))}
    </div>
  );
};
