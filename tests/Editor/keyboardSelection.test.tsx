import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { MockEditor } from '../mocks';
import { runFixtureTests, BaseTestCase } from '../fixture';
import * as editorUtilsModule from '../../src/Editor/callbacks/utils';
import { TextSelection } from '../../src/Selection/types';
import { getSelectionText } from '../../src/Selection/utils';
import * as SelectionModule from '../../src/Selection';

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
  runFixtureTests<TestCase, Common>('Editor', 'keyboardSelection', (testCase, common) => {
    const spiedPositionToCursorCoordinate = jest.spyOn(editorUtilsModule, 'positionToCursorCoordinate');
    const SpiedTextLines = jest.spyOn(SelectionModule, 'Selection');

    const text = common.textLines.join('\n');
    const { rerender } = render(<MockEditor initText={text} />);

    spiedPositionToCursorCoordinate.mockImplementation(() => common.initCoordinate);
    userEvent.click(screen.getByTestId('editor-body'));
    userEvent.type(screen.getByRole('textbox'), testCase.inputTyping.join(''));

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
