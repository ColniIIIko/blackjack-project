import React, { useMemo } from 'react';
import { PlayerState, Winner } from '../../types/general';
import CardHand from '../CardHand/CardHand';
import PlayerInfo from '../PlayerInfo/PlayerInfo';

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

  const isWin = useMemo(() => isEnd && winner === 'player', [isEnd, winner]);
  const isLose = useMemo(() => isBusted || (isEnd && winner === 'dealer'), [isBusted, isEnd, winner]);

  return (
    <div className={styles['player']}>
      <CardHand
        hand={hand}
        score={score}
        isWin={isWin}
        isLose={isLose}
      />
      <PlayerInfo
        bet={bet}
        endGameLabel={endGameLabel}
        isLose={isLose}
        isWin={isWin}
        playerName={DEFAULT_PLAYER_NAME}
      />
    </div>
  );
}

export default Player;
