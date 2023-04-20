import React, { useMemo } from 'react';
import { Card as CardType } from '../../types/cards';
import Card from '../Card/Card';
import CardSkeleton from '../CardSkeleton/CardSkeleton';

import styles from './cardHand.module.css';
import classNames from 'classnames';

type Props = {
  isBusted: boolean;
  score: number;
  hand: CardType[];
};

function DealerCardHand({ score, hand, isBusted }: Props) {
  const scoreStyle = useMemo(
    () =>
      classNames({
        [styles['score-box']]: true,
        [styles['score-box__lose']]: isBusted,
      }),
    [isBusted]
  );

  return (
    <div className={styles['card-hand']}>
      <div className={styles['score']}>
        <div className={scoreStyle}>{score}</div>
      </div>
      <div className={styles['cards']}>
        {hand.length ? (
          <>
            {hand.map((card, index) => (
              <Card
                isDealerCard={true}
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
    </div>
  );
}

export default DealerCardHand;
