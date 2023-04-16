import { BlackJackDealer } from '../entities/BlackJackDealer';
import { BlackJackHand } from '../entities/BlackJackHand';
import { BlackJackPlayer } from '../entities/BlackJackPlayer';
import { CardDeck } from '../entities/CardDeck';
import { Card } from '../types/cards';
import { Bet, GameStatus, User } from '../types/general';

const DEFAULT_NUMBER_OF_DECKS = 2;

export class BlackJackController {
  public dealer: BlackJackDealer = new BlackJackDealer();
  public deck: CardDeck = new CardDeck(DEFAULT_NUMBER_OF_DECKS);

  public players: BlackJackPlayer[] = [];
  public currentPlayer: BlackJackPlayer | null = null;
  public gameStatus: GameStatus = GameStatus.IDLE;
  public insuranceCount: number = 0;

  private currentPlayerIndex = 0;

  public drawInitialCards() {
    this.activePlayers.forEach((player) => {
      const playersInitialCards = this.drawInitialPlayerCards();
      player.currentHand.cards = playersInitialCards;
    });

    const dealerInitialCards = this.drawInitialDealerCards();
    const bjDealerHand = new BlackJackHand(dealerInitialCards);
    this.dealer.hand = bjDealerHand;

    return {
      players: this.playersToJSON(),
      dealer: this.dealer.toJSON(),
    };
  }

  get activePlayers() {
    return this.players.filter((player) => player.isActive);
  }

  get activePlayerAmount() {
    return this.players.filter((player) => player.isActive).length;
  }

  get playersAmount() {
    return this.players.length;
  }

  get bettedPlayersAmount() {
    return this.players.filter((player) => player.currentHand.bet !== 0).length;
  }

  public playersToJSON() {
    return this.players.map((player) => player.toJSON());
  }

  public handlePlayerBet(socketId: string, bet: Bet) {
    const player = this.getBySocketId(socketId);
    if (player) {
      player.currentHand.bet = bet;
      player.balance -= bet;
    }
  }

  public handlePlayerDoubleDown() {
    this.currentPlayer!.balance -= this.currentPlayer!.currentHand.bet;
    this.currentPlayer!.currentHand.bet *= 2;
  }

  public handlePlayerInsurance(socketId: string) {
    const player = this.getBySocketId(socketId);
    if (!player) return;

    const insuranceBet = player!.currentHand.bet * 0.5;
    player.balance -= insuranceBet;
    player.insuranceBet = insuranceBet;
  }

  public getBySocketId(socketId: string) {
    return this.players.find((player) => player.socketId === socketId);
  }

  public handleNewUser(user: User, socketId: string) {
    const bjPlayer = new BlackJackPlayer(user.id, user.name, user.balance, socketId);

    if (this.gameStatus === GameStatus.IDLE) {
      bjPlayer.isActive = true;
    }
    this.players.push(bjPlayer);
  }

  public drawPlayerCard() {
    this.currentPlayer!.currentHand.cards.push(this.deck.drawCard(false)!);
  }

  public drawDealerCard() {
    if (this.dealer.hand.cards[1].isHidden) {
      this.dealer.hand.cards[1].isHidden = false;
    } else if (!this.dealer.isEnded) {
      this.dealer.hand.cards.push(this.deck.drawCard(false)!);
    }
  }

  public setNextHand() {
    this.currentPlayer!.setNextHand();
  }

  public hasNextPlayer() {
    return this.activePlayerAmount > this.currentPlayerIndex + 1;
  }

  public setNextPlayer() {
    if (this.hasNextPlayer()) {
      this.currentPlayer!.isCurrent = false;
      this.currentPlayerIndex += 1;
      this.currentPlayer = this.activePlayers[this.currentPlayerIndex];
      this.currentPlayer.isCurrent = true;
    }
  }

  public setGameResults() {
    this.currentPlayer = null;
    this.activePlayers.forEach((player) => {
      player.hand.forEach((hand) => {
        if (player.totalWin === null) player.totalWin = 0;
        const playerWin = hand.bet * (hand.isBlackJack && !player.isSplitted ? 1.5 : 2);

        if (hand.isBusted) {
          hand.result = 'dealer';
        } else if (this.dealer.hand.isBusted) {
          hand.result = 'player';
          player.totalWin += playerWin;
        } else if (this.dealer.hand.score > hand.score) {
          hand.result = 'dealer';
        } else if (this.dealer.hand.score < hand.score) {
          hand.result = 'player';
          player.totalWin += playerWin;
        } else {
          hand.result = 'draw';
          player.totalWin += hand.bet;
        }
      });

      player.balance += player.totalWin ?? 0;
    });
  }

  public removePlayerBySocketId(socketId: string) {
    const player = this.getBySocketId(socketId);
    if (player) {
      this.players = this.players.filter((p) => p.id !== player.id);

      if (this.currentPlayer?.id === player?.id && this.hasNextPlayer()) {
        this.currentPlayerIndex -= 1;
        this.setNextPlayer();
      }
    }
  }

  public gameReset() {
    this.deck = new CardDeck(DEFAULT_NUMBER_OF_DECKS);
    this.players.forEach((player) => player.reset());
    this.dealer.reset();
    this.insuranceCount = 0;
    this.currentPlayerIndex = 0;
    if (this.activePlayerAmount > 0) {
      this.currentPlayer = this.activePlayers[this.currentPlayerIndex];
      this.currentPlayer.isCurrent = true;
    }
  }

  private drawInitialPlayerCards(): [Card, Card] {
    if (this.deck.length > 10) {
      return [this.deck.drawCard(false)!, this.deck.drawCard(false)!];
    } else {
      throw new Error('there is not enough cards in deck to start game');
    }
  }

  private drawInitialDealerCards(): [Card, Card] {
    if (this.deck.length > 10) {
      return [this.deck.drawCard(false)!, this.deck.drawCard(true)!];
    } else {
      throw new Error('there is not enough cards in deck to start game');
    }
  }
}

const bjController = new BlackJackController();
export default bjController;
