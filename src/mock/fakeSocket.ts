import { CardDeck } from '../entities/CardDeck';
import { Card } from '../types/cards';
import { Bet, DealerState, PlayerChoice as PlayerDecision, PlayerState } from '../types/general';
import { getCardsScore } from '../utils/cardUtils';

const INITIAL_PLAYER_STATE = {
  hand: [],
  isBusted: false,
  score: 0,
  isBlackJack: false,
  bet: 0,
} satisfies PlayerState;

const INITIAL_DEALER_STATE = {
  hand: [],
  isBusted: false,
  score: 0,
  isEnded: false,
  isBlackJack: false,
} satisfies DealerState;

const DEFAULT_NUMBER_OF_DECKS = 2;

type States = {
  player: PlayerState;
  dealer: DealerState;
};

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
  private playerState: PlayerState = INITIAL_PLAYER_STATE;
  private dealerState: DealerState = INITIAL_DEALER_STATE;
  private deck: CardDeck = new CardDeck(DEFAULT_NUMBER_OF_DECKS);

  constructor() {
    this.initFakeEvents();
  }

  private initFakeEvents() {
    // starting game and delaying bet phase draw
    this.on('start-game', () => {
      this.gameReset();
      this.execWithDelay(() => {
        this.emit('make-bet');
      }, 500);
    });

    this.on('player-bet', (bet: Bet) => {
      const player = this.handlePlayerBet(bet);
      //TODO: here should be check for player current balance or not?
      this.execWithDelay(() => {
        this.emit('player-bet-accepted', player);
      }, 500);
    });

    this.on('player-bet-accepted', () => {
      const states = this.drawInitialCards();
      this.execWithDelay(() => {
        this.emit('initial-cards', states);
      }, 500);
    });

    //after drawing initial cards we are giving player a little time before
    //decision phase
    this.on('initial-cards', (states: States) => {
      this.execWithDelay(() => {
        if (states.player.isBlackJack) {
          this.emit('player-decision', 'stand');
        } else {
          const possibleChoices: PlayerDecision[] = ['hit', 'stand', 'double down']; // faking only two options for now
          this.emit('make-decision', possibleChoices);
        }
      }, 2000);
    });

    this.on('player-decision', (decision: PlayerDecision) => {
      // for now we have only to options: hit and stand
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
      }
    });

    this.on('end-game', () => {
      this.execWithDelay(() => {
        this.emit('start-game');
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

  private gameReset() {
    this.deck = new CardDeck(DEFAULT_NUMBER_OF_DECKS);
    this.playerState = { ...INITIAL_PLAYER_STATE };
    this.dealerState = { ...INITIAL_DEALER_STATE };
  }

  private drawInitialCards() {
    const playersInitialCards = this.drawInitialPlayerCards();
    this.playerState.hand = playersInitialCards;
    this.playerState.score = getCardsScore(playersInitialCards);
    this.playerState.isBlackJack = this.playerState.score === 21;

    const dealerInitialCards = this.drawInitialDealerCards();
    this.dealerState.hand = dealerInitialCards;
    this.dealerState.score = getCardsScore(dealerInitialCards);
    this.dealerState.isBlackJack = this.dealerState.score === 21;

    return {
      player: { ...this.playerState, hand: [...this.playerState.hand] },
      dealer: { ...this.dealerState, hand: [...this.dealerState.hand] },
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
    this.playerState.hand.push(this.deck.drawCard(false)!);
    this.playerState.score = getCardsScore(this.playerState.hand);
    this.playerState.isBusted = this.playerState.score > 21;
    return { ...this.playerState };
  }

  public drawDealerCard() {
    if (this.dealerState.hand[1].isHidden) {
      this.dealerState.hand[1].isHidden = false;
    } else if (getCardsScore(this.dealerState.hand) < 17) {
      this.dealerState.hand.push(this.deck.drawCard(false)!);
    }

    this.dealerState.score = getCardsScore(this.dealerState.hand);
    this.dealerState.isBusted = this.dealerState.score > 21;
    this.dealerState.isEnded = this.dealerState.score >= 17;

    return { ...this.dealerState, hand: [...this.dealerState.hand] };
  }

  private handlePlayerDraw() {
    const playerResponse = this.drawPlayerCard();
    this.emit('player-draw', playerResponse);
    if (!playerResponse.isBusted) {
      this.execWithDelay(() => {
        const possibleChoices: PlayerDecision[] = ['hit', 'stand'];
        this.emit('make-decision', possibleChoices);
      }, 1000);
    } else {
      this.execWithDelay(() => {
        this.emit('end-game', { winner: 'dealer', playerWin: 0 });
      }, 1000);
    }
  }

  private handlePlayerDoubleDown() {
    this.playerState.bet *= 2;
    const playerResponse = this.drawPlayerCard();
    this.emit('player-draw', playerResponse);
    if (!playerResponse.isBusted) {
      this.execWithDelay(() => {
        this.handlePlayerStand();
      }, 1000);
    } else {
      this.execWithDelay(() => {
        this.emit('end-game', { winner: 'dealer', playerWin: 0 });
      }, 1000);
    }
  }

  private handlePlayerStand() {
    this.handleDealerPlay();
  }

  private handleDealerPlay() {
    const dealerResponse = this.drawDealerCard();
    this.emit('dealer-draw', dealerResponse);

    const playerWin = this.playerState.bet * (this.playerState.isBlackJack ? 1.5 : 2);
    this.execWithDelay(() => {
      if (dealerResponse.isBusted) {
        this.emit('end-game', { winner: 'player', playerWin });
      } else if (dealerResponse.score < 17) {
        this.handleDealerPlay();
      } else {
        if (dealerResponse.score < this.playerState.score) {
          this.emit('end-game', { winner: 'player', playerWin });
        } else if (dealerResponse.score > this.playerState.score) {
          this.emit('end-game', { winner: 'dealer', playerWin: 0 });
        } else {
          this.emit('end-game', { winner: 'draw', playerWin: this.playerState.bet });
        }
      }
    }, 1000);
  }

  private handlePlayerBet(bet: Bet) {
    this.playerState.bet = bet;

    return { ...this.playerState, hand: [...this.playerState.hand] };
  }

  private execWithDelay(callback: () => void, delay: number) {
    window.setTimeout(() => {
      callback();
    }, delay);
  }
}

export const socket = new FakeSocket();
