import React, { useMemo } from 'react';
import { Card as CardType } from '../../types/cards';
import Card from '../Card/Card';
import CardSkeleton from '../CardSkeleton/CardSkeleton';
import HandInfo from '../HandInfo/HandInfo';
import { Bet } from '../../types/general';
import classNames from 'classnames';

import styles from './cardHand.module.css';

type Props = {
  isWin: boolean;
  isLose: boolean;
  isCurrent: boolean;
  endGameLabel: string | null;
  score: number;
  hand: CardType[];
  bet: Bet | 0;
};

function PlayerCardHand({ isWin, isLose, isCurrent, score, hand, endGameLabel, bet }: Props) {
  const scoreStyle = useMemo(
    () =>
      classNames({
        [styles['score']]: true,
        [styles['player-score']]: true,
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
      {hand.length ? (
        <div className={styles['player-hand']}>
          <div className={styles['player-cards']}>
            <div className={scoreStyle}>{score}</div>
            {hand.map((card, index) => (
              <Card
                transformIndex={index}
                key={`$${card.suit}_${card.value}_${index}`}
                {...card}
              />
            ))}
          </div>
          <HandInfo
            bet={bet}
            endGameLabel={endGameLabel}
            isWin={isWin}
            isLose={isLose}
          />
        </div>
      ) : (
        <div className={styles['cards']}>
          <CardSkeleton />
          <CardSkeleton />
        </div>
      )}
    </div>
  );
}

export default PlayerCardHand;
