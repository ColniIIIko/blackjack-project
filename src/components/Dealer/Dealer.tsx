import React from 'react';
import CardHand from '../CardHand/CardHand';
import { DealerState } from '../../types/general';

import styles from './dealer.module.css';

type Props = Omit<DealerState, 'isEnded'>;

function Dealer({ hand, score, isBusted }: Props) {
  return (
    <div className={styles['dealer']}>
      <CardHand
        hand={hand}
        isLose={isBusted}
        score={score}
        isWin={false}
      />
      {isBusted && <p className={styles['bust-label']}>BUST</p>}
    </div>
  );
}

export default Dealer;
