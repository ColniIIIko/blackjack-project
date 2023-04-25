import React from 'react';

import { PlayerChoice } from '@/types/general';

import Timer from '@/components/Timer/Timer';

import styles from './playerOptionChoice.module.css';

type Props = {
  choices: PlayerChoice[];
  onChoice: (choice: PlayerChoice) => void;
  isTimerOn: boolean;
};

const OPTIONS: PlayerChoice[] = ['double down', 'hit', 'stand', 'split'];
const OPTIONS_SINGS = ['2X', '+', '-', '<>'];
const START_TIME = 15;

function PlayerOptionChoice({ choices, isTimerOn, onChoice }: Props) {
  return (
    <div className={styles['window']}>
      <h2 className={styles['heading']}>MAKE YOUR DECISION</h2>
      <div className={styles['options']}>
        {OPTIONS.map((opt, index) => (
          <div
            key={index}
            className={`${styles['labeled-option']} ${!choices.includes(opt) ? styles['option_disabled'] : ''}`}
          >
            {choices.includes(opt) ? (
              <div
                className={styles['option']}
                onClick={() => onChoice(opt)}
              >
                {OPTIONS_SINGS[index]}
              </div>
            ) : (
              <div className={styles['option']}>{OPTIONS_SINGS[index]}</div>
            )}
            <p className={styles['option-label']}>{opt}</p>
          </div>
        ))}
      </div>
      {isTimerOn && (
        <Timer
          startTime={START_TIME}
          onTimerEnd={() => onChoice('stand')}
        />
      )}
    </div>
  );
}

export default PlayerOptionChoice;
