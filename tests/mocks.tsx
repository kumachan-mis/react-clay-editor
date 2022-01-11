import { Screen } from '@testing-library/dom';
import React from 'react';

import { Editor, EditorProps } from '../src';

export type MockEditorProps = Omit<EditorProps, 'text' | 'onChangeText'> & { initText?: string };

export const MockEditor: React.FC<MockEditorProps> = ({ initText = '', ...props }) => {
  const [text, setText] = React.useState(initText);
  return (
    <>
      <Editor text={text} onChangeText={setText} {...props} />
      <MockTextLines text={text} />
    </>
  );
};

export const MockTextLines: React.FC<{ text: string }> = ({ text }) => (
  <div>
    {text.split('\n').map((line, i) => (
      <div key={i} data-testid={`mock-line-${i}`}>
        {line}
      </div>
    ))}
  </div>
);

export function expectTextLinesToBe(screen: Screen, expectedLines: string[]): void {
  for (let i = 0; i < expectedLines.length; i++) {
    const line = expectedLines[i];
    expect(screen.getByTestId(`mock-line-${i}`).textContent).toBe(line);
  }
  expect(screen.queryByTestId(`mock-line-${expectedLines.length}`)).not.toBeInTheDocument();
}

export interface SpyOnGetBoundingClientRectConfig {
  chars: number;
  lines: number;
  size: number;
  margin: number;
}

export class SpyOnGetBoundingClientRect {
  private screen: Screen;
  private config: SpyOnGetBoundingClientRectConfig;

  constructor(screen: Screen, config?: SpyOnGetBoundingClientRectConfig) {
    if (!config) config = { chars: 15, lines: 10, size: 10, margin: 1 };

    this.screen = screen;
    this.config = config;
  }

  char(lineIndex: number, charIndex: number): jest.SpyInstance<DOMRect, []> {
    const element = this.screen.getByTestId(`char-L${lineIndex}C${charIndex}`);
    const [width, height] = [this.config.size, this.config.size];
    const [x, y] = [
      this.config.size * charIndex,
      this.config.margin + (this.config.size + 2 * this.config.margin) * lineIndex,
    ];
    return this.getSpyInstance(element, width, height, x, y);
  }

  charGroup(lineIndex: number, firstCharIndex: number, lastCharIndex: number): jest.SpyInstance<DOMRect, []> {
    const element = this.screen.getByTestId(`char-group-L${lineIndex}C${firstCharIndex}-${lastCharIndex}`);
    const [width, height] = [this.config.size * (lastCharIndex - firstCharIndex + 1), this.config.size];
    const [x, y] = [
      this.config.size * firstCharIndex,
      this.config.margin + (this.config.size + 2 * this.config.margin) * lineIndex,
    ];
    return this.getSpyInstance(element, width, height, x, y);
  }

  line(lineIndex: number): jest.SpyInstance<DOMRect, []> {
    const element = this.screen.getByTestId(`line-L${lineIndex}`);
    const [width, height] = [this.config.size * this.config.chars, this.config.size + 2 * this.config.margin];
    const [x, y] = [0, (this.config.size + 2 * this.config.margin) * lineIndex];
    return this.getSpyInstance(element, width, height, x, y);
  }

  lineGroup(firstLineIndex: number, lastLineIndex: number): jest.SpyInstance<DOMRect, []> {
    const element = this.screen.getByTestId(`line-group-L${firstLineIndex}-${lastLineIndex}`);
    const [width, height] = [
      this.config.size * this.config.chars,
      (this.config.size + 2 * this.config.margin) * (lastLineIndex - firstLineIndex + 1),
    ];
    const [x, y] = [0, (this.config.size + 2 * this.config.margin) * firstLineIndex];
    return this.getSpyInstance(element, width, height, x, y);
  }

  editorBody(): jest.SpyInstance<DOMRect, []> {
    const element = this.screen.getByTestId('editor-body');
    const [width, height] = [
      this.config.size * this.config.chars,
      (this.config.size + 2 * this.config.margin) * this.config.lines,
    ];
    const [x, y] = [0, 0];
    return this.getSpyInstance(element, width, height, x, y);
  }

  private getSpyInstance(
    element: HTMLElement,
    width: number,
    height: number,
    x: number,
    y: number
  ): jest.SpyInstance<DOMRect, []> {
    const domRect = { width, height, top: y, left: x, bottom: y + height, right: x + width, x, y, toJSON: () => ({}) };
    const spyInstance = jest.spyOn(element, 'getBoundingClientRect');
    spyInstance.mockImplementation(() => domRect);
    return spyInstance;
  }
}

export function mockElementsFromPoint(x: number, y: number, elements: HTMLElement[]): HTMLElement[] {
  return elements.filter((element) => {
    const rect = element.getBoundingClientRect();
    return rect.left <= x && x <= rect.right && rect.top <= y && y <= rect.bottom;
  });
}
