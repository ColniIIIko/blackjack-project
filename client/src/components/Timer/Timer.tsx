import React from 'react';

import { useCountDown } from '@/hooks/useCountDown';

import styles from './timer.module.css';

type Props = {
  startTime: number;
  onTimerEnd: () => void;
};

function Timer({ startTime, onTimerEnd }: Props) {
  const timer = useCountDown(startTime, onTimerEnd);
  return (
    <div
      className={styles['timer']}
      data-test={'timer'}
    >
      {timer}
    </div>
  );
}

export default Timer;
