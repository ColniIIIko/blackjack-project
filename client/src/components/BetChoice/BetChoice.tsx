import React, { useCallback, useContext, useState } from 'react';
import { Bet } from '../../types/general';
import Timer from '../Timer/Timer';

import styles from './betChoice.module.css';
import { UserContext } from '../../stores/UserStore/UserStore';

type Props = {
  onBet: (bet: Bet) => void;
  defaultBet: Bet;
  isTimerOn: boolean;
};

const BET_OPTIONS: Bet[] = [20, 25, 50, 100, 200];
const START_TIME = 30;

function BetChoice({ onBet, defaultBet, isTimerOn }: Props) {
  const { setPreviousBet } = useContext(UserContext)!;
  const [currentBet, setCurrentBet] = useState<Bet>(defaultBet);

  const handleBet = useCallback(() => {
    setPreviousBet(currentBet);
    onBet(currentBet);
  }, [currentBet, onBet, setPreviousBet]);

  return (
    <div className={styles['window']}>
      <h2 className={styles['heading']}>MAKE YOUR BET</h2>
      <div className={styles['options']}>
        {BET_OPTIONS.map((opt) => (
          <div
            key={opt}
            className={`${styles['option']} ${currentBet === opt ? styles['option_active'] : ''}`}
            onClick={() => setCurrentBet(opt)}
            onDoubleClick={handleBet}
          >
            {opt}
          </div>
        ))}
      </div>
      {isTimerOn && (
        <Timer
          startTime={START_TIME}
          onTimerEnd={() => onBet(currentBet)}
        />
      )}
    </div>
  );
}

export default BetChoice;
