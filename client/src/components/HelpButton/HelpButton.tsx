import React from 'react';
import { HELP_URL } from '../../const';

import styles from './helpButton.module.css';

function HelpButton() {
  return (
    <div className={styles['help-btn']}>
      <img
        className={styles['help-ico']}
        src={HELP_URL.href}
        alt='help'
      />
    </div>
  );
}

export default HelpButton;
