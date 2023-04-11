import React from 'react';

import styles from './dealer.module.css';
import { DealerState } from '../../types/state';
import DealerCardHand from '../CardHand/DealerCardHand';

type Props = DealerState;

function Dealer({ hand }: Props) {
  return (
    <div className={styles['dealer']}>
      <DealerCardHand
        hand={hand.cards}
        score={hand.score}
        isBusted={hand.isBusted}
      />
      {hand.isBusted && <p className={styles['bust-label']}>BUST</p>}
    </div>
  );
}

export default Dealer;
