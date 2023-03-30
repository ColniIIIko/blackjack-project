import React from 'react';
import { DealerState } from '../../types/general';
import Card from '../Card/Card';

import styles from './dealer.module.css';

type Props = Omit<DealerState, 'isEnded'>;

function Dealer({ hand, score, isBusted }: Props) {
  return (
    <div className={styles['dealer']}>
      <div className={styles['score']}>{score}</div>
      <div className={styles['cards']}>
        {hand.length ? (
          <>
            {hand.map((card, index) => (
              <Card
                transformIndex={index}
                key={`$${card.suit}_${card.value}`}
                {...card}
              />
            ))}
          </>
        ) : (
          <div>empty</div>
        )}
      </div>
    </div>
  );
}

export default Dealer;
