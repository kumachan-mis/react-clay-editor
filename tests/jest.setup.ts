import '@testing-library/jest-dom';
import * as utils from '../src/common/utils';

const spiedSelectIdProps = jest.spyOn(utils, 'selectIdProps');

beforeAll(() => {
  spiedSelectIdProps.mockImplementation((selectId) => ({ 'data-selectid': selectId, 'data-testid': selectId }));
});

afterAll(() => {
  spiedSelectIdProps.mockRestore();
});

afterEach(() => {
  spiedSelectIdProps.mockClear();
});
