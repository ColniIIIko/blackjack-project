import React from 'react';
import { Bet } from '../../types/general';

import styles from './handInfo.module.css';

type Props = {
  bet: Bet | 0;
};

function HandInfo({ bet }: Props) {
  return (
    <div className={styles['hand__stat']}>
      <div className={styles['hand__bet']}>
        <img
          src='/src/assets/chip.svg'
          alt='hand bet icon'
        />
        <span>{bet}</span>
      </div>
    </div>
  );
}

export default HandInfo;
