import React, { useState } from 'react';
import Timer from '../Timer/Timer';

import styles from './insuranceOptionChoice.module.css';

type Props = {
  onChoice: (choice: boolean) => void;
};

const START_TIME = 5;

function InsuranceOptionChoice({ onChoice }: Props) {
  const [currentChoice, setCurrentChoice] = useState(false);

  return (
    <div className={styles['window']}>
      <h2 className={styles['heading']}>INSURANCE?</h2>
      <div className={styles['options']}>
        <div
          className={`${styles['option']} ${currentChoice ? styles['option_active'] : ''}`}
          onClick={() => setCurrentChoice(true)}
          onDoubleClick={() => onChoice(currentChoice)}
        >
          yes
        </div>
        <div
          className={`${styles['option']} ${!currentChoice ? styles['option_active'] : ''}`}
          onClick={() => setCurrentChoice(false)}
          onDoubleClick={() => onChoice(currentChoice)}
        >
          no
        </div>
      </div>
      <Timer
        startTime={START_TIME}
        onTimerEnd={() => onChoice(currentChoice)}
      />
    </div>
  );
}

export default InsuranceOptionChoice;
