import React, { useCallback } from 'react';

import { socket } from '@/socket';

import styles from './startGameButton.module.css';

function StartGameButton() {
  const handleStart = useCallback(() => {
    socket.emit('player-game-start');
  }, []);

  return (
    <button
      onClick={handleStart}
      className={styles['start-btn']}
    >
      START GAME
    </button>
  );
}

export default StartGameButton;
