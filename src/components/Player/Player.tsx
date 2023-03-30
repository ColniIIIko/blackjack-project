import React from 'react';
import { PlayerState } from '../../types/general';
import Card from '../Card/Card';

import styles from './player.module.css';

type Props = PlayerState;

const DEFAULT_PLAYER_NAME = 'anonymous';

function Player({ hand, score, isBusted }: Props) {
  return (
    <div className={styles['player']}>
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
      <p className={styles['player__name']}>{DEFAULT_PLAYER_NAME}</p>
    </div>
  );
}

export default Player;
