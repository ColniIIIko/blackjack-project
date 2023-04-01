import React, { useState } from 'react';
import { Bet } from '../../types/general';
import Timer from '../Timer/Timer';

import styles from './betChoice.module.css';

type Props = {
  onBet: (bet: Bet) => void;
  defaultBet: Bet;
};

const BET_OPTIONS: Bet[] = [20, 25, 50, 100, 200];
const START_TIME = 30;

function BetChoice({ onBet, defaultBet }: Props) {
  const [currentBet, setCurrentBet] = useState<Bet>(defaultBet);

  return (
    <div className={styles['window']}>
      <h2 className={styles['heading']}>MAKE YOUR BET</h2>
      <div className={styles['options']}>
        {BET_OPTIONS.map((opt) => (
          <div
            key={opt}
            className={`${styles['option']} ${currentBet === opt ? styles['option_active'] : ''}`}
            onClick={() => setCurrentBet(opt)}
            onDoubleClick={() => onBet(currentBet)}
          >
            {opt}
          </div>
        ))}
      </div>
      <Timer
        startTime={START_TIME}
        onTimerEnd={() => onBet(currentBet)}
      />
    </div>
  );
}

export default BetChoice;
