// Imports
import { render } from '@testing-library/react';

// To Test
import App from '../App';

// Tests
describe('Renders main page correctly', () => {
  beforeEach(() => {
    const modalElement = document.createElement('div');
    modalElement.id = 'modal-window';
    document.body.appendChild(modalElement);

    const overlayElement = document.createElement('div');
    overlayElement.id = 'overlay-loader';
    document.body.appendChild(overlayElement);
  });
  it('test', () => {
    render(<App />);
    expect(true).toBeTruthy();
  });
});
