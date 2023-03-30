import React, { useState } from 'react';
import { useCountDown } from '../../hooks/useCountDown';
import { Bet } from '../../types/general';

import styles from './betChoice.module.css';

type Props = {
  onBet: (bet: Bet) => void;
  defaultBet: Bet;
};

const BET_OPTIONS: Bet[] = [20, 25, 50, 100, 200];
const START_TIME = 30;

function BetChoice({ onBet, defaultBet }: Props) {
  const [currentBet, setCurrentBet] = useState<Bet>(defaultBet);
  const timer = useCountDown(START_TIME, () => onBet(currentBet));

  return (
    <div className={styles['window']}>
      <h2 className={styles['heading']}>MAKE YOUR BET</h2>
      <div className={styles['options']}>
        {BET_OPTIONS.map((opt) => (
          <div
            className={`${styles['option']} ${currentBet === opt ? styles['option_active'] : ''}`}
            onClick={() => setCurrentBet(opt)}
            onDoubleClick={() => onBet(currentBet)}
          >
            {opt}
          </div>
        ))}
      </div>
      <div className={styles['timer']}>{timer}</div>
    </div>
  );
}

export default BetChoice;
