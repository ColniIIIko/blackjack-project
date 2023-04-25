import React from 'react';

import { CLOSE_URL } from '@/const';

import styles from './gameTableHeader.module.css';

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
