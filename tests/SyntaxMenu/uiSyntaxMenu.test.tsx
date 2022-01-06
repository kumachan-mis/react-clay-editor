import { EventType } from '@testing-library/dom';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { EditorProps } from '../../src';
import * as utils from '../../src/Editor/callbacks/utils';
import { osUserAgents } from '../constants';
import { runFixtureTests, BaseTestCase } from '../fixture';
import { MockEditor, expectTextLinesToBe } from '../mocks';

interface TestCase extends BaseTestCase {
  name: string;
  textLines: string[];
  inputMouse: {
    type: EventType;
    coordinate: {
      lineIndex: number;
      charIndex: number;
    };
    init?: MouseEventInit;
  }[];
  inputMenu: {
    name: string;
    menuButton: 'icon-button' | 'dropdown-anchor-button' | 'dropdown-anchor-arrow';
    menuItemName?: string;
  };
  inputTyping: string[];
  expectedLinesAfterMenu: string[];
  expectedLinesAfterTyping: string[];
}

interface Common {
  options?: Omit<EditorProps, 'text' | 'onChangeText' | 'syntax'>;
}

const originalUserAgent = window.navigator.userAgent;
const spiedPositionToCursorCoordinate = jest.spyOn(utils, 'positionToCursorCoordinate');

beforeAll(() => {
  Object.defineProperty(window.navigator, 'userAgent', { value: osUserAgents.windows, configurable: true });
  spiedPositionToCursorCoordinate.mockImplementation((text, pos) => ({ lineIndex: pos[1], charIndex: pos[0] }));
});

afterAll(() => {
  Object.defineProperty(window.navigator, 'userAgent', { value: originalUserAgent, configurable: true });
  spiedPositionToCursorCoordinate.mockRestore();
});

describe('UI of SyntaxMenu (bracket syntax)', () => {
  afterEach(() => {
    spiedPositionToCursorCoordinate.mockClear();
  });

  const testfun = createTest('bracket');
  for (const fixtureName of [
    'uiSectionMenuBracket',
    'uiItemizationMenuBracket',
    // 'uiDecorationMenuBracket',
    // 'uiLinkMenuCommon',
    // 'uiCodeMenuCommon',
    // 'uiFormulaMenuCommon',
    'uiQuotationMenuCommon',
  ]) {
    runFixtureTests<TestCase>('SyntaxMenu', fixtureName, testfun);
  }
});

describe('UI of SyntaxMenu (markdown syntax)', () => {
  afterEach(() => {
    spiedPositionToCursorCoordinate.mockClear();
  });

  const testfun = createTest('markdown');
  for (const fixtureName of [
    'uiSectionMenuMarkdown',
    'uiItemizationMenuMarkdown',
    // 'uiDecorationMenuMarkdown',
    // 'uiLinkMenuCommon',
    // 'uiCodeMenuCommon',
    // 'uiFormulaMenuCommon',
    'uiQuotationMenuCommon',
  ]) {
    runFixtureTests<TestCase, Common | undefined>('SyntaxMenu', fixtureName, testfun);
  }
});

function createTest(syntax: 'bracket' | 'markdown'): (testCase: TestCase, common: Common | undefined) => void {
  return (testCase, common) => {
    const text = testCase.textLines.join('\n');
    render(<MockEditor syntax={syntax} initText={text} {...common?.options} />);

    const body = screen.getByTestId('editor-body');
    for (const event of testCase.inputMouse) {
      const { lineIndex, charIndex } = event.coordinate;
      fireEvent[event.type](body, { clientX: charIndex, clientY: lineIndex, ...event.init });
    }

    const menu = screen.getByTestId(testCase.inputMenu.name);
    switch (testCase.inputMenu.menuButton) {
      case 'icon-button':
        userEvent.click(menu);
        break;
      case 'dropdown-anchor-button':
        userEvent.click(within(menu).getByTestId(testCase.inputMenu.menuButton));
        break;
      case 'dropdown-anchor-arrow': {
        userEvent.click(within(menu).getByTestId(testCase.inputMenu.menuButton));
        if (testCase.inputMenu.menuItemName) {
          const menuList = screen.getByTestId('dropdown-menu-list');
          userEvent.click(within(menuList).getByTestId(testCase.inputMenu.menuItemName));
        }
        expect(screen.queryByTestId('dropdown-menu-list')).not.toBeInTheDocument();
        break;
      }
      default:
        throw new Error(`Test is broken. Unknown menuButton: ${testCase.inputMenu.menuButton}`);
    }

    expectTextLinesToBe(screen, testCase.expectedLinesAfterMenu);
    userEvent.keyboard(testCase.inputTyping.join(''));
    expectTextLinesToBe(screen, testCase.expectedLinesAfterTyping);
  };
}
