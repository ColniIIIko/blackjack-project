import { Socket, Server } from 'socket.io';
import bjController from './BlackJackController';
import { ClientToServerEvents, ServerToClientEvents } from '../types/socket';
import { Bet, GameStatus, PlayerChoice, User } from '../types/general';

export class SocketController {
  private io: Server<ClientToServerEvents, ServerToClientEvents>;
  private sockets: Record<string, Socket<ClientToServerEvents, ServerToClientEvents>>;

  constructor(io: Server<ClientToServerEvents, ServerToClientEvents>) {
    this.io = io;
    this.sockets = {};
  }

  public initSocket(socket: Socket<ClientToServerEvents, ServerToClientEvents>) {
    this.sockets[socket.id] = socket;

    socket.on('player-room-enter', (user: User) => {
      bjController.handleNewUser(user, socket.id);
      this.io.emit('table-join', {
        players: bjController.playersToJSON(),
        dealer: bjController.dealer.toJSON(),
      });
      if (bjController.activePlayerAmount === 1 && bjController.gameStatus !== GameStatus.PLAYING) {
        this.startGame();
      }
    });

    socket.on('player-bet', (bet: Bet) => {
      //this.handlePlayerBet(bet);
      bjController.handlePlayerBet(socket.id, bet);
      //TODO: here should be check for player current balance or not?
      const player = bjController.getBySocketId(socket.id);
      socket.emit('player-balance-update', player!.toJSON());
      this.io.emit('table-bet-accepted', bjController.playersToJSON());
      if (bjController.bettedPlayersAmount === bjController.activePlayerAmount) {
        this.handleInitialCard();
      }
    });

    socket.on('player-insurance', (decision: boolean) => {
      const player = bjController.getBySocketId(socket.id);

      if (!player) return;

      bjController.insuranceCount += 1;

      if (decision) {
        const insuranceBet = player!.currentHand.bet * 0.5;
        player.balance -= insuranceBet;
        player.insuranceBet = insuranceBet;
        this.io.emit('table-update', bjController.playersToJSON());
      }

      if (bjController.activePlayerAmount === bjController.insuranceCount) {
        this.handleInsurance();
      }
    });

    socket.on('player-decision', (decision: PlayerChoice) => {
      switch (decision) {
        case 'hit': {
          this.handlePlayerDraw();
          break;
        }
        case 'stand': {
          this.handlePlayerStand();
          break;
        }
        case 'double down': {
          this.handlePlayerDoubleDown();
          break;
        }
        case 'split': {
          this.handlePlayerSplit();
        }
      }
    });

    socket.on('disconnect', () => {
      bjController.removePlayerBySocketId(socket.id);
      if (bjController.activePlayerAmount === 0) {
        bjController.gameStatus = GameStatus.IDLE;
      }
      this.io.emit('table-update', bjController.playersToJSON());
    });
  }

  private startGame() {
    bjController.gameReset();
    bjController.gameStatus = GameStatus.PLAYING;
    const isSingle = bjController.activePlayerAmount === 1;
    this.io.emit('table-start-game', bjController.playersToJSON(), isSingle);
    this.execWithDelay(() => {
      bjController.activePlayers.forEach((player) => {
        const socket = this.sockets[player.socketId];
        socket.emit('table-make-bet');
      });
    }, 500);
  }

  private handleEndGame() {
    bjController.setGameResults();
    this.io.emit('table-end-game', bjController.playersToJSON());
    bjController.activePlayers.forEach((player) => {
      const socket = this.sockets[player.socketId];
      socket.emit('player-balance-update', player.toJSON());
    });

    bjController.gameStatus = GameStatus.IDLE;
    if (bjController.playersAmount !== 0) {
      bjController.players.forEach((player) => {
        player.isActive = true;
      });

      this.execWithDelay(() => {
        this.startGame();
      }, 2000);
    }
  }

  private handleInitialCard() {
    const states = bjController.drawInitialCards();
    this.io.emit('table-initial-cards', states);
    this.execWithDelay(() => {
      if (bjController.dealer.hand.cards[0].value === 'A') {
        bjController.activePlayers.forEach((player) => {
          const socket = this.sockets[player.socketId];
          socket.emit('table-make-insurance');
        });
      } else {
        this.handleDecision();
      }
    }, 2500);
  }

  private handleDecision() {
    if (bjController.currentPlayer!.currentHand.isBlackJack) {
      this.handlePlayerStand();
      return;
    }
    const possibleChoices: PlayerChoice[] = ['hit', 'stand'];
    if (bjController.currentPlayer!.hand.length === 1 && bjController.currentPlayer!.currentHand.isSplitPossible) {
      possibleChoices.push('split');
    }
    if (bjController.currentPlayer!.hand[0].cards.length === 2 && !bjController.currentPlayer!.isSplitted) {
      possibleChoices.push('double down');
    }
    const socket = this.sockets[bjController.currentPlayer!.socketId];
    this.execWithDelay(() => {
      socket.emit('make-decision', possibleChoices);
    }, 1000);
  }

  // probably need to add event for win/lose insurance bet
  private handleInsurance() {
    this.execWithDelay(() => {
      if (bjController.dealer.getHiddenCardValue() === 10) {
        for (const player of bjController.activePlayers) {
          if (player!.insuranceBet) {
            player!.totalWin = player!.insuranceBet * 3;
          }
        }
        this.handleDealerPlay();
      } else {
        this.handleDecision();
      }
    }, 500);
  }

  private handlePlayerDraw() {
    bjController.drawPlayerCard();
    this.io.emit('table-player-draw', bjController.playersToJSON());
    if (!bjController.currentPlayer!.currentHand.isBusted) {
      this.handleDecision();
    } else if (bjController.currentPlayer!.hasNextHand()) {
      this.handleNextHand();
    } else if (bjController.hasNextPlayer()) {
      this.handleNextPlayer();
    } else if (bjController.activePlayerAmount === 1) {
      this.execWithDelay(() => {
        this.handleEndGame();
      }, 1000);
    } else {
      this.handleDealerPlay();
    }
  }

  private handlePlayerDoubleDown() {
    bjController.currentPlayer!.balance -= bjController.currentPlayer!.currentHand.bet;
    bjController.currentPlayer!.currentHand.bet *= 2;
    const socket = this.sockets[bjController.currentPlayer!.socketId];
    socket.emit('player-balance-update', bjController.currentPlayer!.toJSON());
    bjController.drawPlayerCard();
    this.io.emit('table-player-draw', bjController.playersToJSON());
    if (!bjController.currentPlayer!.currentHand.isBusted) {
      this.execWithDelay(() => {
        this.handlePlayerStand();
      }, 1000);
    } else if (bjController.hasNextPlayer()) {
      this.handleNextPlayer();
    } else {
      this.handleEndGame();
    }
  }

  private handlePlayerSplit() {
    if (
      bjController.currentPlayer!.balance >= bjController.currentPlayer!.currentHand.bet &&
      bjController.currentPlayer!.splitHand()
    ) {
      bjController.currentPlayer!.balance -= bjController.currentPlayer!.currentHand.bet;
      const socket = this.sockets[bjController.currentPlayer!.socketId];
      socket.emit('player-balance-update', bjController.currentPlayer!.toJSON());
      this.io.emit('table-player-draw', bjController.playersToJSON());
      this.execWithDelay(() => {
        bjController.currentPlayer!.hand[0].cards.push(bjController.deck.drawCard(false)!);
        bjController.currentPlayer!.hand[1].cards.push(bjController.deck.drawCard(false)!);
        this.io.emit('table-player-draw', bjController.playersToJSON());

        this.handleDecision();
      }, 500);
    }
  }

  private handlePlayerStand() {
    if (bjController.currentPlayer!.hasNextHand()) {
      this.handleNextHand();
    } else if (bjController.hasNextPlayer()) {
      this.handleNextPlayer();
    } else {
      this.handleDealerPlay();
    }
  }

  private handleNextPlayer() {
    bjController.setNextPlayer();
    this.io.emit('table-next-player', bjController.playersToJSON());
    this.execWithDelay(() => {
      this.handleDecision();
    }, 200);
  }

  private handleNextHand() {
    bjController.setNextHand();
    this.io.emit('table-next-hand', bjController.playersToJSON());
    this.execWithDelay(() => {
      this.handleDecision();
    }, 200);
  }

  private handleDealerPlay() {
    bjController.drawDealerCard();
    this.io.emit('table-dealer-draw', bjController.dealer.toJSON());

    this.execWithDelay(() => {
      if (!bjController.dealer.isEnded) {
        this.handleDealerPlay();
      } else {
        this.handleEndGame();
      }
    }, 600);
  }

  private execWithDelay(callback: () => void, delay: number) {
    setTimeout(() => {
      callback();
    }, delay);
  }
}
