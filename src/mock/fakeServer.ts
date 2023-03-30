import { CardDeck } from '../entities/CardDeck';
import { Card } from '../types/cards';
import { DealerState, PlayerState, Winner } from '../types/general';
import { getCardsScore } from '../utils/cardStringToValue';
const DEFAULT_NUMBER_OF_DECKS = 2;

type DrawPlayerResponse = PlayerState;

type DrawDealerResponse = DealerState;

type WinState = 'win' | 'lose' | 'draw';

class FakeServer {
  private deck: CardDeck = new CardDeck(DEFAULT_NUMBER_OF_DECKS);
  private dealerHand: Card[] = [];
  private playerHand: Card[] = [];

  public restartGame() {
    this.deck = new CardDeck(DEFAULT_NUMBER_OF_DECKS);
    this.dealerHand = [];
    this.playerHand = [];
  }

  public async drawInitialCards(): Promise<{
    player: PlayerState;
    dealer: DealerState;
  }> {
    this.playerHand = this.drawInitialPlayerCards();
    this.dealerHand = this.drawInitialDealerCards();

    return new Promise((res) => {
      res({
        player: {
          hand: this.playerHand,
          score: getCardsScore(this.playerHand),
          isBusted: false,
        },
        dealer: {
          hand: this.dealerHand,
          score: getCardsScore(this.dealerHand),
          isBusted: false,
          isEnded: false,
        },
      });
    });
  }

  public async drawPlayerCard(): Promise<DrawPlayerResponse> {
    return new Promise((res, rej) => {
      if (getCardsScore(this.playerHand) > 21) {
        rej('Unable to hit when player is busted');
      }

      this.playerHand.push(this.deck.drawCard(false)!);
      const score = getCardsScore(this.playerHand);
      res({
        hand: this.playerHand,
        score: score,
        isBusted: score > 21,
      });
    });
  }

  public async drawDealerCard(): Promise<DrawDealerResponse> {
    return new Promise((res, rej) => {
      const currentDealerScore = getCardsScore(this.dealerHand);
      if (currentDealerScore > 21) {
        rej('Unable to hit when dealer is busted');
      }
      if (currentDealerScore >= 17) {
        rej('Unable to hit when dealer score is greater than 17');
      }

      if (this.dealerHand.length === 2) this.dealerHand[1].isHidden = false;
      else {
        this.dealerHand.push(this.deck.drawCard(false)!);
      }
      const newDealerScore = getCardsScore(this.dealerHand);
      res({
        hand: this.dealerHand,
        score: newDealerScore,
        isBusted: newDealerScore > 21,
        isEnded: newDealerScore >= 17,
      });
    });
  }

  public async resolveGameEnd(): Promise<{
    winner: Winner;
  }> {
    return new Promise((res, rej) => {
      const dealerScore = getCardsScore(this.dealerHand);
      const playerScore = getCardsScore(this.playerHand);
      if (dealerScore < 17) {
        rej('Unable to end game: dealer can draw cards');
      }

      if (playerScore > 21 && dealerScore <= 21) {
        res({
          winner: 'dealer',
        });
      }
      if (dealerScore > 21 && playerScore <= 21) {
        res({
          winner: 'player',
        });
      }

      if (dealerScore > playerScore) {
        res({
          winner: 'dealer',
        });
      } else if (dealerScore < playerScore) {
        res({
          winner: 'player',
        });
      } else {
        res({
          winner: 'draw',
        });
      }
    });
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

export const server = new FakeServer();
