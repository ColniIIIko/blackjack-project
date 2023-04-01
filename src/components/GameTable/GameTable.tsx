import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { socket } from '../../mock/fakeSocket';
import { DealerState, PlayerChoice as PlayerDecision, PlayerState, Winner } from '../../types/general';
import Dealer from '../Dealer/Dealer';
import ModalWindow from '../ModalWindow/ModalWindow';
import Player from '../Player/Player';
import PlayerOptionChoice from '../PlayerOptionChoice/playerOptionChoice';

import styles from './gameTable.module.css';

function GameTable() {
  const { playerState, dealerState, isChoosing, handleDecision, winner } = useBlackJackState();

  const winLabel = useMemo(() => (winner === 'draw' ? 'DRAW' : `${winner?.toLocaleUpperCase()} WINS`), [winner]);

  return (
    <main className={styles['table']}>
      <ModalWindow isVisible={isChoosing}>
        <PlayerOptionChoice
          onChoice={(choice) => handleDecision(choice)}
          defaultChoice='stand'
          choices={['hit', 'stand']}
        />
      </ModalWindow>
      {winner && <span className={styles['win-label']}>{winLabel}</span>}
      <Player {...playerState} />
      <Dealer {...dealerState} />
    </main>
  );
}

const INITIAL_PLAYER_STATE: PlayerState = {
  hand: [],
  isBusted: false,
  score: 0,
};

const INITIAL_DEALER_STATE: DealerState = {
  hand: [],
  isBusted: false,
  score: 0,
  isEnded: false,
};

type States = {
  player: PlayerState;
  dealer: DealerState;
};

const useBlackJackState = () => {
  const [isChoosing, setIsChoosing] = useState(false);
  const [playerState, setPlayerState] = useState<PlayerState>(INITIAL_PLAYER_STATE);
  const [dealerState, setDealerState] = useState<DealerState>(INITIAL_DEALER_STATE);
  const [isGameEnd, setIsGameEnd] = useState(false);
  const [winner, setWinner] = useState<Winner | null>(null);

  const handleDecision = useCallback((decision: PlayerDecision) => {
    setIsChoosing(false);
    socket.emit('player-decision', decision);
  }, []);

  useEffect(() => {
    socket.on('initial-cards', (states: States) => {
      setPlayerState(states.player);
      setDealerState(states.dealer);
    });

    socket.on('make-decision', () => {
      setIsChoosing(true);
    });

    socket.on('player-draw', (player: PlayerState) => {
      setPlayerState(player);
    });

    socket.on('dealer-draw', (dealer: DealerState) => {
      console.log('dealer-draw', dealer);
      setDealerState(dealer);
    });

    socket.on('end-game', ({ winner }: { winner: Winner }) => {
      setIsGameEnd(true);
      setWinner(winner);
    });

    socket.on('start-game', () => {
      setPlayerState(INITIAL_PLAYER_STATE);
      setDealerState(INITIAL_DEALER_STATE);
      setWinner(null);
      setIsGameEnd(false);
    });

    socket.emit('start-game');
  }, []);

  return { playerState, dealerState, isChoosing, handleDecision, winner, isGameEnd };
};

// const useBlackJackState = () => {
//   const [isChoosing, setIsChoosing] = useState(false);
//   const [playerState, setPlayerState] = useState<PlayerState>(INITIAL_PLAYER_STATE);
//   const [dealerState, setDealerState] = useState<DealerState>(INITIAL_DEALER_STATE);
//   const [isGameEnd, setIsGameEnd] = useState(false);
//   const [winner, setWinner] = useState<Winner | null>(null);

//   const [timerId, setTimerId] = useState<number | null>(null);

//   const handleGameEnd = useCallback(async () => {
//     try {
//       const response = await server.resolveGameEnd();
//       setWinner(response.winner);
//     } catch (e) {
//       console.log(e);
//     }
//   }, []);

//   const handleDealerDraw = useCallback(
//     async (isEnded: boolean) => {
//       if (!isEnded) {
//         const timer = window.setTimeout(async () => {
//           const response = await server.drawDealerCard();
//           setDealerState(response);
//           handleDealerDraw(response.isEnded);
//         }, 1000);
//         setTimerId(timer);
//       } else if (timerId) {
//         clearTimeout(timerId);
//         setIsGameEnd(true);
//       }
//     },
//     [timerId]
//   );

//   const handleInitialCardDraw = useCallback(async () => {
//     const response = await server.drawInitialCards();
//     setDealerState(response.dealer);
//     setPlayerState(response.player);
//   }, []);

//   const handleChoice = useCallback(
//     async (choice: PlayerChoice) => {
//       try {
//         if (choice === 'hit') {
//           const response = await server.drawPlayerCard();
//           setPlayerState(response);
//         } else if (choice === 'stand') {
//           const response = await server.drawDealerCard();
//           setDealerState(response);
//           if (!response.isEnded) {
//             handleDealerDraw(response.isEnded);
//           }
//         }
//       } catch (e) {
//         console.log(e);
//       }
//     },
//     [handleDealerDraw]
//   );

//   useEffect(() => {
//     server.restartGame();
//     handleInitialCardDraw();
//     const timer = window.setTimeout(() => {
//       setIsChoosing(true);
//     }, 1000);

//     return () => clearTimeout(timer);
//   }, [handleInitialCardDraw]);

//   useEffect(() => {
//     if (isGameEnd) {
//       let innerTimer: number;
//       handleGameEnd();
//       const timer = window.setTimeout(() => {
//         server.restartGame();
//         handleInitialCardDraw();
//         setIsGameEnd(false);
//         setWinner(null);
//         setDealerState(INITIAL_DEALER_STATE);
//         setPlayerState(INITIAL_PLAYER_STATE);
//         innerTimer = window.setTimeout(() => {
//           setIsChoosing(true);
//         }, 1000);
//       }, 3000);

//       return () => {
//         clearTimeout(timer);
//         if (innerTimer) {
//           clearTimeout(innerTimer);
//         }
//       };
//     }
//   }, [handleGameEnd, handleInitialCardDraw, isGameEnd]);

//   useEffect(() => {
//     if (playerState.isBusted) {
//       setIsGameEnd(true);
//     }
//   }, [playerState.isBusted]);

//   const dealerStateOmit = useMemo(() => {
//     const { isEnded, ...tempDealerState } = dealerState;
//     return tempDealerState;
//   }, [dealerState]);
//   return { playerState, dealerState: dealerStateOmit, handleChoice, isChoosing, isGameEnd, winner };
// };

export default GameTable;
