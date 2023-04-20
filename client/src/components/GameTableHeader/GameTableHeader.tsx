import React from 'react';

import styles from './gameTableHeader.module.css';
import { CLOSE_URL } from '../../const';

type Props = {
  onTableClose: () => void;
};

function GameTableHeader({ onTableClose }: Props) {
  return (
    <div className={styles['header']}>
      <div
        className={styles['close-btn']}
        onClick={onTableClose}
      >
        <img
          className={styles['close-ico']}
          src={CLOSE_URL.href}
          alt='close'
        />
      </div>
    </div>
  );
}

export default GameTableHeader;
