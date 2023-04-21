import React from 'react';

import styles from './room.module.css';

type Props = {
  id: string;
  playersCount: number;
  maxPlayersCount: number;
  onJoin: (id: string) => void;
};

function Room({ id, playersCount, maxPlayersCount, onJoin }: Props) {
  return (
    <div
      className={styles['room']}
      onClick={() => onJoin(id)}
    >
      <span>room#{id.slice(0, 4)}</span>
      <span>
        players: {playersCount}/{maxPlayersCount}
      </span>
    </div>
  );
}

export default Room;
