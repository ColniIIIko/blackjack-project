import React from 'react';
import CardHand from '../CardHand/CardHand';

import styles from './dealer.module.css';
import { DealerState } from '../../types/state';

type Props = DealerState;

function Dealer({ hand }: Props) {
  return (
    <div className={styles['dealer']}>
      <CardHand
        hand={hand.cards}
        isLose={hand.isBusted}
        score={hand.score}
        isWin={false}
        isCurrent={false}
      />
      {hand.isBusted && <p className={styles['bust-label']}>BUST</p>}
    </div>
  );
}

export default Dealer;
