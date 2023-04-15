import { render } from '@testing-library/react';

import App from '../App';

describe('Renders main page correctly', () => {
  it('test', () => {
    render(<App />);
    expect(true).toBeTruthy();
  });
});
