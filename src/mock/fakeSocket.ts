import { CardDeck } from '../entities/CardDeck';
import { Card } from '../types/cards';
import { Bet, User, PlayerChoice as PlayerDecision, Hand } from '../types/general';
import { BlackJackPlayer } from '../entities/BlackJackPlayer';
import { BlackJackDealer } from '../entities/BlackJackDealer';
import { BlackJackHand } from '../entities/BlackJackHand';

const DEFAULT_NUMBER_OF_DECKS = 2;

/*
    GAME CYCLE(basic cycle without bets and related features)
        starting game with "start-game"
        (emitted from client for now)
                    |
                    V
        socket emits "initial-cards" event
        and delaying "make-decision" event,
        so client can show initial cards and
        player have time to think a bit without 
        notification window
                    | -- after delay
                    V
        socket emits "make-decision" event
        player on client gets notification window
        and after player decision client emits "player-decision"
                    |
                    V
    player decide to stand      player decide to draw
            |                            |
            V                            V
    socket emits "dealer draw"           socket emits "player-draw" event
    event until it's busted or           and checking for player score
    score > 17                           if it's > 21: emits "end-game" event (dealer wins)
            |                            else: emits "make-decision event"
            V
    socket emits "end-game" event
    based on player and dealer scores                       
*/

export class FakeSocket {
  private eventsMap: Record<string, CallableFunction[]> = {};

  private dealer: BlackJackDealer = new BlackJackDealer();
  private deck: CardDeck = new CardDeck(DEFAULT_NUMBER_OF_DECKS);
  private player: BlackJackPlayer | null = null;
  private isSingle: boolean = true;

  constructor() {
    this.initFakeEvents();
  }

  private initFakeEvents() {
    // starting game and delaying bet phase draw

    this.on('connect', (player: User) => {
      this.player = new BlackJackPlayer(player.id, player.name, player.balance);
      this.startGame();
    });

    this.on('player-bet', (bet: Bet) => {
      this.handlePlayerBet(bet);
      console.log('before', this.player?.toJSON());
      this.player!.balance -= bet;
      //TODO: here should be check for player current balance or not?
      console.log(this.player?.toJSON());
      console.log('after', this.player?.toJSON());
      this.execWithDelay(() => {
        this.emit('player-bet-accepted', this.player?.toJSON());
      }, 500);
    });

    this.on('player-bet-accepted', () => {
      const states = this.drawInitialCards();
      this.execWithDelay(() => {
        this.emit('initial-cards', states);
      }, 500);
    });

    this.on('initial-cards', () => {
      this.execWithDelay(() => {
        if (this.player!.currentHand.isBlackJack) {
          this.emit('player-decision', 'stand');
        } else if (this.dealer.hand.cards[0].value === 'A') {
          this.emit('make-insurance');
        } else {
          const possibleChoices: PlayerDecision[] = ['hit', 'stand', 'double down'];
          if (this.player?.hand.length === 1 && this.player!.currentHand.isSplitPossible) {
            possibleChoices.push('split');
          }
          this.emit('make-decision', possibleChoices);
        }
      }, 2000);
    });

    this.on('player-insurance', (decision: boolean) => {
      const insuranceBet = this.player!.currentHand.bet * 0.5;
      if (this.player!.balance >= insuranceBet && decision) {
        this.player!.balance -= insuranceBet;
        this.player!.insuranceBet = insuranceBet;
        this.emit('player-update', this.player?.toJSON());
      }

      this.execWithDelay(() => {
        this.handleInsurance();
      }, 500);
    });

    this.on('player-decision', (decision: PlayerDecision) => {
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

    this.on('end-game', () => {
      this.execWithDelay(() => {
        this.startGame();
      }, 2000);
    });
  }

  public on(event: string, listener: CallableFunction) {
    if (event in this.eventsMap) {
      this.eventsMap[event].push(listener);
    } else {
      this.eventsMap[event] = [listener];
    }
  }

  public emit(event: string, ...args: unknown[]) {
    if (event in this.eventsMap) {
      this.eventsMap[event].forEach((listener) => listener(...args));
    }
  }

  private startGame() {
    this.gameReset();
    this.emit('start-game', this.player!.toJSON(), this.isSingle);
    this.execWithDelay(() => {
      this.emit('make-bet');
    }, 500);
  }

  private gameReset() {
    this.deck = new CardDeck(DEFAULT_NUMBER_OF_DECKS);
    this.player?.reset();
    this.dealer.reset();
  }

  private drawInitialCards() {
    const playersInitialCards = this.drawInitialPlayerCards();
    this.player!.currentHand.cards = playersInitialCards;

    const dealerInitialCards = this.drawInitialDealerCards();
    const bjDealerHand = new BlackJackHand(dealerInitialCards);
    this.dealer.hand = bjDealerHand;

    return {
      player: this.player!.toJSON(),
      dealer: this.dealer.toJSON(),
    };
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

  private drawPlayerCard() {
    this.player!.currentHand.cards.push(this.deck.drawCard(false)!);
    return this.player!.toJSON();
  }

  public drawDealerCard() {
    if (this.dealer.hand.cards[1].isHidden) {
      this.dealer.hand.cards[1].isHidden = false;
    } else if (!this.dealer.isEnded) {
      this.dealer.hand.cards.push(this.deck.drawCard(false)!);
    }

    return this.dealer.toJSON();
  }

  private handleInsurance() {
    this.execWithDelay(() => {
      if (this.dealer.getHiddenCardValue() === 10) {
        if (this.player!.insuranceBet) {
          this.player!.totalWin = this.player!.insuranceBet * 3;
          this.emit('player-update', this.player?.toJSON());
        }
        this.handleDealerPlay();
      } else {
        const possibleChoices: PlayerDecision[] = ['hit', 'stand', 'double down'];
        if (this.player?.hand.length === 1 && this.player!.currentHand.isSplitPossible) {
          possibleChoices.push('split');
        }
        this.emit('make-decision', possibleChoices);
      }
    }, 500);
  }

  private handlePlayerDraw() {
    const playerResponse = this.drawPlayerCard();
    this.emit('player-draw', playerResponse);
    if (!playerResponse.currentHand.isBusted) {
      this.execWithDelay(() => {
        const possibleChoices: PlayerDecision[] = ['hit', 'stand'];
        this.emit('make-decision', possibleChoices);
      }, 1000);
    } else if (this.player!.hasNextHand()) {
      this.handleNextHand();
    } else {
      this.execWithDelay(() => {
        this.setGameResults(this.dealer.hand);
        this.emit('end-game', this.player!.toJSON());
      }, 1000);
    }
  }

  private handlePlayerDoubleDown() {
    this.player!.balance -= this.player!.currentHand.bet;
    this.player!.currentHand.bet *= 2;
    const playerResponse = this.drawPlayerCard();
    this.emit('player-draw', playerResponse);
    if (!playerResponse.currentHand.isBusted) {
      this.execWithDelay(() => {
        this.handlePlayerStand();
      }, 1000);
    } else {
      this.execWithDelay(() => {
        this.setGameResults(this.dealer.hand);
        this.emit('end-game', this.player!.toJSON());
      }, 1000);
    }
  }

  private handlePlayerSplit() {
    if (this.player!.balance >= this.player!.currentHand.bet && this.player!.splitHand()) {
      this.player!.balance -= this.player!.currentHand.bet;
      this.emit('player-draw', this.player?.toJSON());
      this.execWithDelay(() => {
        this.player!.hand[0].cards.push(this.deck.drawCard(false)!);
        this.player!.hand[1].cards.push(this.deck.drawCard(false)!);
        this.emit('player-draw', this.player?.toJSON());

        this.execWithDelay(() => {
          const possibleChoices: PlayerDecision[] = ['hit', 'stand'];
          this.emit('make-decision', possibleChoices);
        }, 300);
      }, 500);
    }
  }

  private handlePlayerStand() {
    if (this.player!.hasNextHand()) {
      this.handleNextHand();
    } else {
      this.handleDealerPlay();
    }
  }

  private handleNextHand() {
    this.player!.setNextHand();
    this.emit('next-hand', this.player!.toJSON());
    this.execWithDelay(() => {
      const possibleChoices: PlayerDecision[] = ['hit', 'stand'];
      this.emit('make-decision', possibleChoices);
    }, 100);
  }

  private handleDealerPlay() {
    const dealerResponse = this.drawDealerCard();
    this.emit('dealer-draw', dealerResponse);

    this.execWithDelay(() => {
      if (!dealerResponse.isEnded) {
        this.handleDealerPlay();
      } else {
        this.setGameResults(dealerResponse.hand);
        this.player!.balance += this.player!.totalWin ?? 0;
        this.emit('end-game', this.player!.toJSON());
      }
    }, 600);
  }

  private setGameResults(dealerHand: Hand) {
    this.player!.hand.forEach((hand) => {
      if (this.player!.totalWin === null) this.player!.totalWin = 0;

      const playerWin = hand.bet * (hand.isBlackJack && !this.player!.isSplitted ? 1.5 : 2);

      if (hand.isBusted) {
        hand.result = 'dealer';
      } else if (dealerHand.isBusted) {
        hand.result = 'player';
        this.player!.totalWin += playerWin;
      } else if (dealerHand.score > hand.score) {
        hand.result = 'dealer';
      } else if (dealerHand.score < hand.score) {
        hand.result = 'player';
        this.player!.totalWin += playerWin;
      } else {
        hand.result = 'draw';
        this.player!.totalWin += hand.bet;
      }
    });
  }

  private handlePlayerBet(bet: Bet) {
    this.player!.currentHand.bet = bet;
    return this.player!.toJSON();
  }

  private execWithDelay(callback: () => void, delay: number) {
    window.setTimeout(() => {
      callback();
    }, delay);
  }
}

export const socket = new FakeSocket();
