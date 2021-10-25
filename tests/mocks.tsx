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

export function spyOnCharGetBoundingClientRect(
  screen: Screen,
  lineIndex: number,
  charIndex: number,
  size = 10
): jest.SpyInstance<DOMRect, []> {
  const element = screen.getByTestId(`char-L${lineIndex}C${charIndex}`);
  const spiedGetBoundingClientRect = jest.spyOn(element, 'getBoundingClientRect');

  const [width, height] = [size, size];
  const [x, y] = [size * charIndex, size * lineIndex];

  spiedGetBoundingClientRect.mockImplementation(() => ({
    width,
    height,
    top: y,
    left: x,
    bottom: y + height,
    right: x + width,
    x,
    y,
    toJSON: () => ({}),
  }));

  return spiedGetBoundingClientRect;
}

export function spyOnCharGroupGetBoundingClientRect(
  screen: Screen,
  lineIndex: number,
  fromCharIndex: number,
  toCharIndex: number,
  size = 10
): jest.SpyInstance<DOMRect, []> {
  const element = screen.getByTestId(`char-group-L${lineIndex}C${fromCharIndex}-${toCharIndex}`);
  const spiedGetBoundingClientRect = jest.spyOn(element, 'getBoundingClientRect');

  const [width, height] = [size * (toCharIndex - fromCharIndex + 1), size];
  const [x, y] = [size * fromCharIndex, size * lineIndex];

  spiedGetBoundingClientRect.mockImplementation(() => ({
    width,
    height,
    top: y,
    left: x,
    bottom: y + height,
    right: x + width,
    x,
    y,
    toJSON: () => ({}),
  }));

  return spiedGetBoundingClientRect;
}

export function spyOnLineGetBoundingClientRect(
  screen: Screen,
  lineIndex: number,
  chars: number,
  size = 10
): jest.SpyInstance<DOMRect, []> {
  const element = screen.getByTestId(`line-L${lineIndex}`);
  const spiedGetBoundingClientRect = jest.spyOn(element, 'getBoundingClientRect');

  const [width, height] = [size * chars, size];
  const [x, y] = [0, size * lineIndex];

  spiedGetBoundingClientRect.mockImplementation(() => ({
    width,
    height,
    top: y,
    left: x,
    bottom: y + height,
    right: x + width,
    x,
    y,
    toJSON: () => ({}),
  }));

  return spiedGetBoundingClientRect;
}

export function spyOnLineGroupGetBoundingClientRect(
  screen: Screen,
  fromLineIndex: number,
  toLineIndex: number,
  chars: number,
  size = 10
): jest.SpyInstance<DOMRect, []> {
  const element = screen.getByTestId(`line-group-L${fromLineIndex}-${toLineIndex}`);
  const spiedGetBoundingClientRect = jest.spyOn(element, 'getBoundingClientRect');

  const [width, height] = [size * chars, size * (toLineIndex - fromLineIndex + 1)];
  const [x, y] = [0, size * fromLineIndex];

  spiedGetBoundingClientRect.mockImplementation(() => ({
    width,
    height,
    top: y,
    left: x,
    bottom: y + height,
    right: x + width,
    x,
    y,
    toJSON: () => ({}),
  }));

  return spiedGetBoundingClientRect;
}

export function spyOnEditorBodyGetBoundingClientRect(
  screen: Screen,
  chars: number,
  lines: number,
  size = 10
): jest.SpyInstance<DOMRect, []> {
  const element = screen.getByTestId('editor-body');
  const spiedGetBoundingClientRect = jest.spyOn(element, 'getBoundingClientRect');

  const [width, height] = [size * chars, size * lines];
  const [x, y] = [0, 0];

  spiedGetBoundingClientRect.mockImplementation(() => ({
    width,
    height,
    top: y,
    left: x,
    bottom: y + height,
    right: x + width,
    x,
    y,
    toJSON: () => ({}),
  }));

  return spiedGetBoundingClientRect;
}

export function mockElementsFromPoint(x: number, y: number, elements: HTMLElement[]): HTMLElement[] {
  return elements.filter((element) => {
    const rect = element.getBoundingClientRect();
    return rect.left <= x && x <= rect.right && rect.top <= y && y <= rect.bottom;
  });
}
