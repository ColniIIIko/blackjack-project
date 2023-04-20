import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

configure({ testIdAttribute: 'data-test' });

const modalElement = document.createElement('div');
modalElement.id = 'modal-window';
document.body.appendChild(modalElement);

const overlayElement = document.createElement('div');
overlayElement.id = 'overlay-loader';
document.body.appendChild(overlayElement);
