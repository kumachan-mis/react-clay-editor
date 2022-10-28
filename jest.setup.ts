import '@testing-library/jest-dom';
import * as utils from './src/common/utils';

const spiedCreateTestId = jest.spyOn(utils, 'createTestId');

beforeAll(() => {
  spiedCreateTestId.mockImplementation((testId) => testId);
});

afterAll(() => {
  spiedCreateTestId.mockRestore();
});

afterEach(() => {
  spiedCreateTestId.mockClear();
});
