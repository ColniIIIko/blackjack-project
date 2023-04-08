import React, { useMemo } from 'react';
import { Card as CardType } from '../../types/cards';
import Card from '../Card/Card';
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
        [styles['score-box']]: true,
        [styles['score-box__lose']]: isLose,
        [styles['score-box__win']]: isWin,
      }),
    [isWin, isLose]
  );

  const labelStyle = useMemo(
    () =>
      classNames({
        [styles['end-game-label']]: true,
        [styles['end-game-label__lose']]: isLose,
        [styles['end-game-label__win']]: isWin,
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
      <div className={styles['player-hand']}>
        <div className={styles['player-cards']}>
          <div className={styles['player-score']}>
            <div className={scoreStyle}>{score}</div>
            {endGameLabel && <p className={labelStyle}>{endGameLabel}</p>}
          </div>
          {hand.map((card, index) => (
            <Card
              transformIndex={index}
              key={`$${card.suit}_${card.value}_${index}`}
              {...card}
            />
          ))}
        </div>
        <HandInfo bet={bet} />
      </div>
    </div>
  );
}

export default PlayerCardHand;
