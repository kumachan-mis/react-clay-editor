import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import * as utils from '../../src/Editor/callbacks/utils';
import * as selection from '../../src/components/molecules/selection/Selection';
import { TextSelection } from '../../src/components/molecules/selection/Selection/types';
import { getSelectionText } from '../../src/components/molecules/selection/Selection/utils';
import { osUserAgents } from '../constants';
import { runFixtureTests, BaseTestCase } from '../fixture';
import { MockEditor } from '../mocks';

interface TestCase extends BaseTestCase {
  name: string;
  inputTyping: string[];
  expectedSelectionLines: string[];
}

interface Common {
  textLines: string[];
  initCoordinate: {
    lineIndex: number;
    charIndex: number;
  };
}

describe('keyboardSelection in Editor', () => {
  const originalUserAgent = window.navigator.userAgent;

  beforeAll(() => {
    Object.defineProperty(window.navigator, 'userAgent', { value: osUserAgents.windows, configurable: true });
  });

  afterAll(() => {
    Object.defineProperty(window.navigator, 'userAgent', { value: originalUserAgent, configurable: true });
  });

  runFixtureTests<TestCase, Common>('Editor', 'keyboardSelection', (testCase, common) => {
    const spiedPositionToCursorCoordinate = jest.spyOn(utils, 'positionToCursorCoordinate');
    const SpiedTextLines = jest.spyOn(selection, 'Selection');

    const text = common.textLines.join('\n');
    const { rerender } = render(<MockEditor initText={text} />);

    spiedPositionToCursorCoordinate.mockImplementation(() => common.initCoordinate);
    userEvent.click(screen.getByTestId('editor-body'));
    userEvent.keyboard(testCase.inputTyping.join(''));

    const expectedSelectionText = testCase.expectedSelectionLines.join('\n');
    if (expectedSelectionText) {
      expect(screen.queryAllByTestId('selection')).not.toEqual([]);
    } else {
      expect(screen.queryAllByTestId('selection')).toEqual([]);
    }

    const MockSelection: React.FC<{ textSelection: TextSelection | undefined }> = ({ textSelection }) => (
      <div data-testid="mock-selected-text">{getSelectionText(text, textSelection)}</div>
    );

    SpiedTextLines.mockImplementation(MockSelection);
    rerender(<MockEditor initText={text} />);
    expect(screen.getByTestId('mock-selected-text').textContent).toBe(expectedSelectionText);

    SpiedTextLines.mockRestore();
    spiedPositionToCursorCoordinate.mockRestore();
  });
});
