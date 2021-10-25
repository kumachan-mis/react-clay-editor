import * as React from 'react';
import { Screen } from '@testing-library/dom';

import { Editor, EditorProps } from '../src';

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

const CHARSIZE = 16;

export function spyOnCharGetBoundingClientRect(
  screen: Screen,
  lineIndex: number,
  charIndex: number
): jest.SpyInstance<DOMRect, []> {
  const charEl = screen.getByTestId(`char-L${lineIndex}C${charIndex}`);
  const spiedGetBoundingClientRect = jest.spyOn(charEl, 'getBoundingClientRect');

  spiedGetBoundingClientRect.mockImplementation(() => ({
    width: CHARSIZE,
    height: CHARSIZE,
    top: CHARSIZE * lineIndex,
    left: CHARSIZE * charIndex,
    bottom: CHARSIZE * (lineIndex + 1),
    right: CHARSIZE * (charIndex + 1),
    x: CHARSIZE * charIndex,
    y: CHARSIZE * lineIndex,
    toJSON: () => ({}),
  }));

  return spiedGetBoundingClientRect;
}
