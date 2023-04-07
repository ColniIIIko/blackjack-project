import React, { useMemo } from 'react';
import { Bet } from '../../types/general';
import classNames from 'classnames';

import styles from './handInfo.module.css';

type Props = {
  endGameLabel: string | null;
  bet: Bet | 0;
  isWin: boolean;
  isLose: boolean;
};

function HandInfo({ endGameLabel, bet, isWin, isLose }: Props) {
  const labelStyle = useMemo(
    () =>
      classNames({
        [styles['end-game-label']]: true,
        [styles['end-game-label__lose']]: isLose,
        [styles['end-game-label__win']]: isWin,
      }),
    [isWin, isLose]
  );

  return (
    <div className={styles['hand__info']}>
      <div className={styles['hand__stat']}>
        <div className={styles['hand__bet']}>
          <img
            src='/src/assets/chip.svg'
            alt='hand bet icon'
          />
          <span>{bet}</span>
        </div>
        {endGameLabel && <p className={labelStyle}>{endGameLabel}</p>}
      </div>
    </div>
  );
}

export default HandInfo;
