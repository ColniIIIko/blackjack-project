import React from 'react';

import styles from './playerWin.module.css';
import { CHIP_URL } from '../../const';

type Props = {
  win: number;
};

function PlayerWin({ win }: Props) {
  return (
    <div className={styles['win']}>
      <p className={styles['win-label']}>YOU WIN</p>
      <div className={styles['win-amount']}>
        <img
          src={CHIP_URL.href}
          alt='chip'
        />
        {win}
      </div>
    </div>
  );
}

export default PlayerWin;
