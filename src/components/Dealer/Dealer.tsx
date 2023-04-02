import classNames from 'classnames';
import React from 'react';
import { DealerState } from '../../types/general';
import Card from '../Card/Card';
import CardSkeleton from '../CardSkeleton/CardSkeleton';

import styles from './dealer.module.css';

type Props = Omit<DealerState, 'isEnded'>;

function Dealer({ hand, score, isBusted }: Props) {
  return (
    <div className={styles['dealer']}>
      <div
        className={classNames({
          [styles['score']]: true,
          [styles['score__busted']]: isBusted,
        })}
      >
        {score}
      </div>
      <div className={styles['cards']}>
        {hand.length ? (
          <>
            {hand.map((card, index) => (
              <Card
                transformIndex={index}
                key={`$${card.suit}_${card.value}_${index}`}
                {...card}
              />
            ))}
          </>
        ) : (
          <>
            <CardSkeleton />
            <CardSkeleton />
          </>
        )}
      </div>
      {isBusted && <p className={styles['bust-label']}>BUST</p>}
    </div>
  );
}

export default Dealer;
