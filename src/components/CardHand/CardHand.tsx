import React, { useMemo } from 'react';
import { Card as CardType } from '../../types/cards';
import Card from '../Card/Card';
import CardSkeleton from '../CardSkeleton/CardSkeleton';
import classNames from 'classnames';

import styles from './cardHand.module.css';

type Props = {
  isWin: boolean;
  isLose: boolean;
  isCurrent: boolean;
  score: number;
  hand: CardType[];
};

export default function CardHand({ isWin, isLose, isCurrent, score, hand }: Props) {
  const scoreStyle = useMemo(
    () =>
      classNames({
        [styles['score']]: true,
        [styles['score__lose']]: isLose,
        [styles['score__win']]: isWin,
      }),
    [isWin, isLose]
  );

  const handStyle = useMemo(
    () =>
      classNames({
        [styles['card-hand']]: true,
        [styles['card-hand__current']]: isCurrent,
      }),
    [isCurrent]
  );

  return (
    <div className={handStyle}>
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
