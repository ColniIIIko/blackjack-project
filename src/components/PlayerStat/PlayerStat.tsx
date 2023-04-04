import React, { useMemo } from 'react';
import { Bet } from '../../types/general';
import classNames from 'classnames';

import styles from './playerStat.module.css';

type Props = {
  endGameLabel: string | null;
  playerName: string;
  bet: Bet | 0;
  isWin: boolean;
  isLose: boolean;
};

function PlayerStat({ endGameLabel, playerName, bet, isWin, isLose }: Props) {
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
    <div className={styles['player__info']}>
      <p className={styles['player__name']}>{playerName}</p>
      <div className={styles['player__stat']}>
        <div className={styles['player__bet']}>
          <img
            src='/src/assets/chip.svg'
            alt='player bet icon'
          />
          <span>{bet}</span>
        </div>
        {endGameLabel && <p className={labelStyle}>{endGameLabel}</p>}
      </div>
    </div>
  );
}

export default PlayerStat;
