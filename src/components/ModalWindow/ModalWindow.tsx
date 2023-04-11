import React from 'react';
import { createPortal } from 'react-dom';

import styles from './modalWindow.module.css';

type Props = {
  isVisible: boolean;
  children: React.ReactNode;
};

function ModalWindow({ children, isVisible }: Props) {
  return isVisible
    ? createPortal(<div className={styles['modal-wrapper']}>{children}</div>, document.querySelector('#modal-window')!)
    : null;
}

export default ModalWindow;
