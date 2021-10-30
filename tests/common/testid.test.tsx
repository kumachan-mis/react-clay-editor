import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import * as utils from '../../src/Editor/callbacks/utils';
import { runFixtureTests, BaseTestCase } from '../fixture';
import { MockEditor } from '../mocks';

interface TestCase extends BaseTestCase {
  name: string;
  inputEnvironment: string;
  expectedTestIdExistence: boolean;
}

interface Common {
  textLines: string[];
  suggestions: string[];
}

describe('data-testid existence', () => {
  runFixtureTests<TestCase, Common>('common', 'testid', (testCase, common) => {
    const spiedPositionToCursorCoordinate = jest.spyOn(utils, 'positionToCursorCoordinate');
    spiedPositionToCursorCoordinate.mockImplementation(() => ({
      lineIndex: common.textLines.length - 1,
      charIndex: common.textLines[common.textLines.length - 1].length,
    }));

    const text = common.textLines.join('\n');
    const { rerender } = render(<MockEditor initText={text} hashTagProps={{ suggestions: common.suggestions }} />);
    userEvent.click(screen.getByTestId('editor-body'));

    const originalEnvironment = process.env.ENVIRONMENT;
    Object.defineProperty(process.env, 'ENVIRONMENT', { value: testCase.inputEnvironment, configurable: true });

    rerender(<MockEditor initText={text} hashTagProps={{ suggestions: common.suggestions }} />);
    userEvent.keyboard('#');

    if (testCase.expectedTestIdExistence) {
      expect(screen.queryByTestId('suggestion-header')).toBeInTheDocument();
    } else {
      expect(screen.queryByTestId(/^.*$/)).not.toBeInTheDocument();
    }

    Object.defineProperty(process.env, 'ENVIRONMENT', { value: originalEnvironment, configurable: true });
    spiedPositionToCursorCoordinate.mockRestore();
  });
});
