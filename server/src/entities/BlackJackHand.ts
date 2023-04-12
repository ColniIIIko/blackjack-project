import { v4 as uuid } from 'uuid';
import { Card, CardValue } from '../types/cards';
import { Hand } from '../types/general';

export class BlackJackHand implements Hand {
  public id: string;
  constructor(public cards: Card[] = []) {
    this.id = uuid();
  }

  get score() {
    const hasAce = this.cards.some((card) => card.value === 'A');

    let resultScore = this.cards.reduce(
      (score, card) => (card.isHidden ? score : score + this.cardStringValueToNumber(card.value)),
      0
    );
    if (hasAce && resultScore > 21) {
      resultScore -= 10;
    }

    return resultScore;
  }

  get isBlackJack() {
    if (this.cards.length !== 2) return false;

    return this.score === 21;
  }

  get isBusted() {
    return this.score > 21;
  }

  private cardStringValueToNumber(cardValue: CardValue) {
    if (cardValue === 'A') return 11;
    const value = Number(cardValue);
    return isNaN(value) ? 10 : value;
  }

  public toJSON(): Hand {
    return {
      id: this.id,
      cards: this.cards,
      score: this.score,
      isBlackJack: this.isBlackJack,
      isBusted: this.isBusted,
    };
  }
}
