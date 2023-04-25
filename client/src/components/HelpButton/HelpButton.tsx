import React, { useState } from 'react';
import { HELP_URL } from '@/const';

import Rules from '@/components/Rules/Rules';
import CloseModalWindow from '@/components/ModalWindow/CloseModalWindow';

import styles from './helpButton.module.css';

function HelpButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <CloseModalWindow
        isVisible={isOpen}
        setIsOpen={setIsOpen}
      >
        <Rules />
      </CloseModalWindow>
      <div
        className={styles['help-btn']}
        onClick={() => setIsOpen(true)}
      >
        <img
          className={styles['help-ico']}
          src={HELP_URL.href}
          alt='help'
        />
      </div>
    </>
  );
}

export default HelpButton;
