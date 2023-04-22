import { Socket, Server, BroadcastOperator } from 'socket.io';
import { BlackJackController } from './BlackJackController';
import { ClientToServerEvents, ServerToClientEvents } from '../types/socket';
import { Bet, GameStatus, PlayerChoice, User } from '../types/general';

export class SocketController {
  private io: BroadcastOperator<ServerToClientEvents, any>;
  private sockets: Record<string, Socket<ClientToServerEvents, ServerToClientEvents>>;
  private currentTimer: NodeJS.Timeout | null;
  private bjController: BlackJackController;
  private leaveAction: (roomId: string) => void;
  public readonly roomId: string;

  constructor(
    io: Server<ClientToServerEvents, ServerToClientEvents>,
    roomId: string,
    leaveAction: (roomId: string) => void
  ) {
    this.io = io.to(roomId);
    this.roomId = roomId;
    this.leaveAction = leaveAction;

    this.bjController = new BlackJackController();
    this.sockets = {};
    this.currentTimer = null;
  }

  public get playersAmount() {
    return this.bjController.playersAmount;
  }

  public get maxPlayersAmount() {
    return this.bjController.MAX_PLAYER_AMOUNT;
  }

  public joinRoom(user: User, socket: Socket<ClientToServerEvents, ServerToClientEvents>) {
    if (this.bjController.playersAmount < this.bjController.MAX_PLAYER_AMOUNT) {
      socket.join(this.roomId);
      this.initSocket(socket);

      this.bjController.handleNewUser(user, socket.id);
      socket.emit('table-join', {
        players: this.bjController.playersToJSON(),
        dealer: this.bjController.dealer.toJSON(),
      });
      socket.to(this.roomId).emit('table-update', this.bjController.playersToJSON());

      if (this.bjController.activePlayerAmount > 1 && this.bjController.gameStatus === GameStatus.IDLE) {
        this.startGame();
      }
    } else {
      socket.emit('room-full');
    }
  }

  private initSocket(socket: Socket<ClientToServerEvents, ServerToClientEvents>) {
    this.sockets[socket.id] = socket;

    socket.on('player-game-start', () => {
      if (this.bjController.gameStatus === GameStatus.IDLE) {
        this.startGame();
      }
    });

    socket.on('player-bet', (bet: Bet) => {
      this.bjController.handlePlayerBet(socket.id, bet);

      const player = this.bjController.getBySocketId(socket.id);
      socket.emit('player-balance-update', player!.toJSON());
      this.io.emit('table-bet-accepted', this.bjController.playersToJSON());
      if (this.bjController.bettedPlayersAmount === this.bjController.activePlayerAmount) {
        this.bjController.gameStatus = GameStatus.PLAYING;
        this.handleInitialCard();
      }
    });

    socket.on('player-insurance', (decision: boolean) => {
      this.bjController.insuranceCount += 1;

      if (decision) {
        this.bjController.handlePlayerInsurance(socket.id);
        this.io.emit('table-update', this.bjController.playersToJSON());
        const player = this.bjController.getBySocketId(socket.id);
        socket.emit('player-balance-update', player!.toJSON());
      }
      if (this.bjController.activePlayerAmount === this.bjController.insuranceCount) {
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

    socket.on('player-room-leave', () => {
      this.handlePlayerLeave(socket);
      this.leaveAction(this.roomId);
      socket.removeAllListeners('player-game-start');
      socket.removeAllListeners('player-bet');
      socket.removeAllListeners('player-insurance');
      socket.removeAllListeners('player-decision');
      socket.removeAllListeners('player-leave');
    });

    socket.on('disconnect', () => {
      this.handlePlayerLeave(socket);
      this.leaveAction(this.roomId);
      socket.removeAllListeners('player-game-start');
      socket.removeAllListeners('player-bet');
      socket.removeAllListeners('player-insurance');
      socket.removeAllListeners('player-decision');
      socket.removeAllListeners('player-leave');
    });
  }

  private handlePlayerLeave(socket: Socket<ClientToServerEvents, ServerToClientEvents>) {
    socket.leave(this.roomId);
    this.bjController.removePlayerBySocketId(socket.id);
    if (this.bjController.activePlayerAmount === 0) {
      this.clear();
      if (this.bjController.playersAmount !== 0) {
        this.io.emit('table-full-update', {
          players: this.bjController.playersToJSON(),
          dealer: this.bjController.dealer.toJSON(),
        });
      }
    } else if (
      this.bjController.currentPlayer?.socketId === socket.id &&
      this.bjController.gameStatus === GameStatus.PLAYING
    ) {
      this.bjController.gameStatus = GameStatus.DEALER_PLAY;
      this.execWithDelay(() => {
        this.handleDealerPlay();
      }, 1000);
    } else if (this.bjController.gameStatus === GameStatus.PLAYING) {
      this.handleDecision();
    }
    this.io.emit('table-update', this.bjController.playersToJSON());
  }

  private clear() {
    if (this.currentTimer) {
      clearTimeout(this.currentTimer);
    }

    this.bjController.gameReset();
    this.bjController.gameStatus = GameStatus.IDLE;
  }

  private startGame() {
    this.bjController.gameReset();
    this.bjController.gameStatus = GameStatus.BETTING;
    const isSingle = this.bjController.activePlayerAmount === 1;
    this.io.emit('table-start-game', this.bjController.playersToJSON(), isSingle);
    this.execWithDelay(() => {
      this.bjController.activePlayers.forEach((player) => {
        const socket = this.sockets[player.socketId];
        socket.emit('table-make-bet');
      });
    }, 500);
  }

  private handleEndGame() {
    this.bjController.setGameResults();
    this.io.emit('table-end-game', this.bjController.playersToJSON());
    this.bjController.activePlayers.forEach((player) => {
      const socket = this.sockets[player.socketId];
      socket.emit('player-balance-update', player.toJSON());
    });

    this.bjController.gameStatus = GameStatus.IDLE;
    if (this.bjController.playersAmount !== 0) {
      this.bjController.players.forEach((player) => {
        player.isActive = true;
      });

      this.execWithDelay(() => {
        this.startGame();
      }, 2000);
    }
  }

  private handleInitialCard() {
    const states = this.bjController.drawInitialCards();
    this.io.emit('table-initial-cards', states);
    this.execWithDelay(() => {
      if (this.bjController.dealer.hand.cards[0].value === 'A') {
        this.bjController.activePlayers.forEach((player) => {
          const socket = this.sockets[player.socketId];
          socket.emit('table-make-insurance');
        });
      } else {
        this.handleDecision();
      }
    }, 2500);
  }

  private handleDecision() {
    if (this.bjController.currentPlayer!.currentHand.isBlackJack) {
      this.handlePlayerStand();
      return;
    }
    const possibleChoices: PlayerChoice[] = ['hit', 'stand'];
    if (
      this.bjController.currentPlayer!.hand.length === 1 &&
      this.bjController.currentPlayer!.currentHand.isSplitPossible
    ) {
      possibleChoices.push('split');
    }
    if (this.bjController.currentPlayer!.hand[0].cards.length === 2 && !this.bjController.currentPlayer!.isSplitted) {
      possibleChoices.push('double down');
    }
    const socket = this.sockets[this.bjController.currentPlayer!.socketId];
    this.execWithDelay(() => {
      socket.emit('make-decision', possibleChoices);
    }, 1000);
  }

  private handleInsurance() {
    if (this.bjController.dealer.getHiddenCardValue() === 10) {
      for (const player of this.bjController.activePlayers) {
        if (player!.insuranceBet) {
          player!.totalWin = player!.insuranceBet * 3;
        }
      }
      this.execWithDelay(() => {
        this.bjController.gameStatus = GameStatus.DEALER_PLAY;
        this.handleDealerPlay();
      }, 1000);
    } else {
      this.execWithDelay(() => {
        this.handleDecision();
      }, 400);
    }
  }

  private handlePlayerDraw() {
    this.bjController.drawPlayerCard();
    this.io.emit('table-player-draw', this.bjController.playersToJSON());
    if (!this.bjController.currentPlayer!.currentHand.isBusted) {
      this.handleDecision();
    } else if (this.bjController.currentPlayer!.hasNextHand()) {
      this.handleNextHand();
    } else if (this.bjController.hasNextPlayer()) {
      this.handleNextPlayer();
    } else if (this.bjController.activePlayerAmount === 1 && this.bjController.currentPlayer?.hand.length === 1) {
      this.execWithDelay(() => {
        this.handleEndGame();
      }, 1000);
    } else {
      this.bjController.gameStatus = GameStatus.DEALER_PLAY;
      this.execWithDelay(() => {
        this.handleDealerPlay();
      }, 1000);
    }
  }

  private handlePlayerDoubleDown() {
    this.bjController.handlePlayerDoubleDown();
    const socket = this.sockets[this.bjController.currentPlayer!.socketId];
    socket.emit('player-balance-update', this.bjController.currentPlayer!.toJSON());
    this.bjController.drawPlayerCard();
    this.io.emit('table-player-draw', this.bjController.playersToJSON());
    if (!this.bjController.currentPlayer!.currentHand.isBusted) {
      this.execWithDelay(() => {
        this.handlePlayerStand();
      }, 1000);
    } else if (this.bjController.hasNextPlayer()) {
      this.handleNextPlayer();
    } else {
      this.execWithDelay(() => {
        this.handleEndGame();
      }, 1000);
    }
  }

  private handlePlayerSplit() {
    if (this.bjController.currentPlayer!.splitHand()) {
      const socket = this.sockets[this.bjController.currentPlayer!.socketId];
      socket.emit('player-balance-update', this.bjController.currentPlayer!.toJSON());
      this.io.emit('table-player-draw', this.bjController.playersToJSON());
      this.execWithDelay(() => {
        this.bjController.currentPlayer!.hand[0].cards.push(this.bjController.deck.drawCard(false)!);
        this.bjController.currentPlayer!.hand[1].cards.push(this.bjController.deck.drawCard(false)!);
        this.io.emit('table-player-draw', this.bjController.playersToJSON());

        this.handleDecision();
      }, 500);
    }
  }

  private handlePlayerStand() {
    if (this.bjController.currentPlayer!.hasNextHand()) {
      this.handleNextHand();
    } else if (this.bjController.hasNextPlayer()) {
      this.handleNextPlayer();
    } else {
      this.bjController.gameStatus = GameStatus.DEALER_PLAY;
      this.execWithDelay(() => {
        this.handleDealerPlay();
      }, 1000);
    }
  }

  private handleNextPlayer() {
    this.bjController.setNextPlayer();
    this.io.emit('table-next-player', this.bjController.playersToJSON());
    this.execWithDelay(() => {
      this.handleDecision();
    }, 200);
  }

  private handleNextHand() {
    this.bjController.setNextHand();
    this.io.emit('table-next-hand', this.bjController.playersToJSON());
    this.execWithDelay(() => {
      this.handleDecision();
    }, 200);
  }

  private handleDealerPlay() {
    this.bjController.drawDealerCard();
    this.io.emit('table-dealer-draw', this.bjController.dealer.toJSON());

    this.execWithDelay(() => {
      if (!this.bjController.dealer.isEnded) {
        this.handleDealerPlay();
      } else {
        this.handleEndGame();
      }
    }, 1000);
  }

  private execWithDelay(callback: () => void, delay: number) {
    this.currentTimer = setTimeout(() => {
      callback();
    }, delay);
  }
}
