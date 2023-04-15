import React from 'react';
import Timer from '../Timer/Timer';

import styles from './insuranceOptionChoice.module.css';

type Props = {
  onChoice: (choice: boolean) => void;
  isTimerOn: boolean;
};

const START_TIME = 5;

function InsuranceOptionChoice({ onChoice, isTimerOn }: Props) {
  return (
    <div className={styles['window']}>
      <h2 className={styles['heading']}>INSURANCE?</h2>
      <div className={styles['options']}>
        <div
          className={styles['option']}
          onClick={() => onChoice(true)}
        >
          yes
        </div>
        <div
          className={styles['option']}
          onClick={() => onChoice(false)}
        >
          no
        </div>
      </div>
      {isTimerOn && (
        <Timer
          startTime={START_TIME}
          onTimerEnd={() => onChoice(false)}
        />
      )}
    </div>
  );
}

export default InsuranceOptionChoice;
