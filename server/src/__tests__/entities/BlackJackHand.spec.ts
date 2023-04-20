import { BlackJackHand } from '../../entities/BlackJackHand';
import { Card } from '../../types/cards';

describe('BlackJackHand', () => {
  describe('score', () => {
    it('should have a score property based on its cards values', () => {
      const cards: Card[] = [
        { suit: 'hearts', value: '2', isHidden: false },
        { suit: 'diamonds', value: '4', isHidden: false },
      ];
      const blackJackHand = new BlackJackHand(cards);
      expect(blackJackHand.score).toBe(6);
    });

    it('should correctly handle Ace as 11 in the score calculation', () => {
      const cards: Card[] = [
        { suit: 'hearts', value: 'A', isHidden: false },
        { suit: 'diamonds', value: '6', isHidden: false },
      ];
      const blackJackHand = new BlackJackHand(cards);
      expect(blackJackHand.score).toBe(17);
    });

    it('should correctly handle Ace as 1 in the score calculation', () => {
      const cards: Card[] = [
        { suit: 'hearts', value: 'A', isHidden: false },
        { suit: 'diamonds', value: '6', isHidden: false },
        { suit: 'hearts', value: '9', isHidden: false },
      ];
      const blackJackHand = new BlackJackHand(cards);
      expect(blackJackHand.score).toBe(16);
    });

    it('should correctly handle multiple aces in the score calculation', () => {
      const cards: Card[] = [
        { suit: 'hearts', value: 'A', isHidden: false },
        { suit: 'diamonds', value: '6', isHidden: false },
        { suit: 'spades', value: 'A', isHidden: false },
      ];
      const blackJackHand = new BlackJackHand(cards);
      expect(blackJackHand.score).toBe(18);
    });
  });

  describe('isBlackJack', () => {
    it('should correctly identify BlackJack hand', () => {
      const cards: Card[] = [
        { suit: 'hearts', value: 'A', isHidden: false },
        { suit: 'diamonds', value: 'K', isHidden: false },
      ];
      const blackJackHand = new BlackJackHand(cards);
      expect(blackJackHand.isBlackJack).toBe(true);
    });

    it('should correctly identify not BlackJack hand', () => {
      const cards: Card[] = [
        { suit: 'hearts', value: 'A', isHidden: false },
        { suit: 'diamonds', value: 'K', isHidden: false },
        { suit: 'clubs', value: '10', isHidden: false },
      ];
      const blackJackHand = new BlackJackHand(cards);
      expect(blackJackHand.isBlackJack).toBe(false);
    });
  });

  describe('isBusted', () => {
    it('should correctly identify busted hands', () => {
      const cards: Card[] = [
        { suit: 'hearts', value: '6', isHidden: false },
        { suit: 'diamonds', value: 'K', isHidden: false },
        { suit: 'clubs', value: 'Q', isHidden: false },
      ];
      const blackJackHand = new BlackJackHand(cards);
      expect(blackJackHand.isBusted).toBe(true);
    });

    it('should correctly identify not busted hands', () => {
      const cards: Card[] = [
        { suit: 'hearts', value: 'A', isHidden: false },
        { suit: 'diamonds', value: 'K', isHidden: false },
        { suit: 'clubs', value: 'Q', isHidden: false },
      ];
      const blackJackHand = new BlackJackHand(cards);
      expect(blackJackHand.isBusted).toBe(false);
    });
  });

  describe('toJSON', () => {
    it('should serialize to JSON correctly', () => {
      const cards: Card[] = [
        { suit: 'hearts', value: 'A', isHidden: false },
        { suit: 'diamonds', value: 'K', isHidden: false },
        { suit: 'clubs', value: 'Q', isHidden: false },
      ];
      const blackJackHand = new BlackJackHand(cards);
      const expected = {
        id: blackJackHand.id,
        cards: cards,
        score: blackJackHand.score,
        isBlackJack: blackJackHand.isBlackJack,
        isBusted: blackJackHand.isBusted,
      };
      expect(blackJackHand.toJSON()).toEqual(expected);
    });
  });
});
