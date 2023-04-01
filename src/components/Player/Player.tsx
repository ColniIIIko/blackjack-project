import React from 'react';
import { PlayerState } from '../../types/general';
import Card from '../Card/Card';
import CardSkeleton from '../CardSkeleton/CardSkeleton';

import styles from './player.module.css';

type Props = PlayerState;

const DEFAULT_PLAYER_NAME = 'anonymous';

function Player({ hand, score, isBusted, bet }: Props) {
  return (
    <div className={styles['player']}>
      <div className={styles['score']}>{score}</div>
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
      <div className={styles['player__info']}>
        <p className={styles['player__name']}>{DEFAULT_PLAYER_NAME}</p>
        {bet && (
          <div className={styles['player__bet']}>
            <img
              src='/src/assets/chip.svg'
              alt='player bet icon'
            />
            <span>{bet}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Player;
