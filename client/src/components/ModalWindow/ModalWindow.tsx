import React from 'react';
import { createPortal } from 'react-dom';

import styles from './modalWindow.module.css';

type Props = {
  isVisible: boolean;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
};

function ModalWindow({ children, onClick, isVisible }: Props) {
  return isVisible
    ? createPortal(
        <div
          className={styles['modal-wrapper']}
          onClick={onClick}
        >
          <div
            className={styles['modal-inner']}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {children}
          </div>
        </div>,
        document.querySelector('#modal-window')!
      )
    : null;
}

export default ModalWindow;
