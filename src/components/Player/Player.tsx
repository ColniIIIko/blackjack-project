import React, { useMemo } from 'react';
import { PlayerState, Winner } from '../../types/general';
import Card from '../Card/Card';
import CardSkeleton from '../CardSkeleton/CardSkeleton';
import classNames from 'classnames';

import styles from './player.module.css';

type Props = PlayerState & {
  isEnd: boolean;
  winner: Winner | null;
};

const DEFAULT_PLAYER_NAME = 'anonymous';

function Player({ hand, score, isBusted, bet, isEnd, winner }: Props) {
  const endGameLabel = useMemo(() => {
    if (!isEnd) return null;

    if (isBusted) return 'BUST';

    if (winner === 'player') return 'WIN';

    if (winner === 'draw') return 'DRAW';

    return 'LOSE';
  }, [isBusted, isEnd, winner]);

  return (
    <div className={styles['player']}>
      <div
        className={classNames({
          [styles['score']]: true,
          [styles['score__lose']]: isBusted || (isEnd && winner === 'dealer'),
          [styles['score__win']]: isEnd && winner === 'player',
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
      <div className={styles['player__info']}>
        <p className={styles['player__name']}>{DEFAULT_PLAYER_NAME}</p>
        <div className={styles['player__stat']}>
          <div className={styles['player__bet']}>
            <img
              src='/src/assets/chip.svg'
              alt='player bet icon'
            />
            <span>{bet}</span>
          </div>
          {endGameLabel && (
            <p
              className={classNames({
                [styles['end-game-label']]: true,
                [styles['end-game-label__lose']]: isBusted || (isEnd && winner === 'dealer'),
                [styles['end-game-label__win']]: isEnd && winner === 'player',
              })}
            >
              {endGameLabel}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Player;
