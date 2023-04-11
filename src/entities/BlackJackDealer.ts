import { Dealer } from '../types/general';
import { DealerState } from '../types/state';
import { BlackJackHand } from './BlackJackHand';

export class BlackJackDealer implements Dealer {
  public hand: BlackJackHand;
  constructor() {
    this.hand = new BlackJackHand();
  }

  public reset() {
    this.hand = new BlackJackHand();
  }

  public getHiddenCardValue() {
    const cardValue = this.hand.cards[1].value;
    if (cardValue === 'A') return 11;
    const value = Number(cardValue);
    return isNaN(value) ? 10 : value;
  }

  get isEnded() {
    if (!this.hand) return false;

    return this.hand.score >= 17;
  }

  public toJSON(): DealerState {
    return {
      hand: this.hand ? this.hand.toJSON() : this.hand,
      isEnded: this.isEnded,
    };
  }
}
