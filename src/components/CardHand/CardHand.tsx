import React, { useMemo } from 'react';
import { Card as CardType } from '../../types/cards';
import Card from '../Card/Card';
import CardSkeleton from '../CardSkeleton/CardSkeleton';
import classNames from 'classnames';

import styles from './cardHand.module.css';

type Props = {
  isWin: boolean;
  isLose: boolean;
  score: number;
  hand: CardType[];
};

export default function CardHand({ isWin, isLose, score, hand }: Props) {
  const scoreStyle = useMemo(
    () =>
      classNames({
        [styles['score']]: true,
        [styles['score__lose']]: isLose,
        [styles['score__win']]: isWin,
      }),
    [isWin, isLose]
  );

  return (
    <div className={styles['card-hand']}>
      <div className={scoreStyle}>{score}</div>
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
    </div>
  );
}
