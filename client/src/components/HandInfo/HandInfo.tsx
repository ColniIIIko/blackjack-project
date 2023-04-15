import React from 'react';
import { Bet } from '../../types/general';
import { CHIP_URL } from '../../const';

import styles from './handInfo.module.css';

type Props = {
  bet: Bet | 0;
};

function HandInfo({ bet }: Props) {
  return (
    <div className={styles['hand__stat']}>
      <div className={styles['hand__bet']}>
        <img
          className={styles['hand__bet-ico']}
          src={CHIP_URL.href}
          alt='hand bet icon'
        />
        <span>{bet}</span>
      </div>
    </div>
  );
}

export default HandInfo;
