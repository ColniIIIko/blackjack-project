import React from 'react';
import { PlayerState } from '../../types/state';

import styles from './players.module.css';
import Player from '../Player/Player';

type Props = {
  players: PlayerState[];
  isEnd: boolean;
};

function Players({ players, isEnd }: Props) {
  return (
    <div className={styles['players']}>
      {players.map((player) => (
        <Player
          key={player.id}
          {...player}
          isEnd={isEnd}
        />
      ))}
    </div>
  );
}

export default Players;
