import { Card } from '../../types/cards';
import { BlackJackPlayerHand } from '../../entities/BlackJackPlayerHand';

describe('BlackJackPlayerHand', () => {
  describe('isSplitPossible', () => {
    it('should return true if the hand has two cards with the same value', () => {
      const cards: Card[] = [
        { value: '7', suit: 'diamonds', isHidden: false },
        { value: '7', suit: 'clubs', isHidden: false },
      ];
      const playerHand = new BlackJackPlayerHand(cards);
      expect(playerHand.isSplitPossible).toBe(true);
    });

    it('should return false if the hand has two cards with different values', () => {
      const cards: Card[] = [
        { value: '2', suit: 'hearts', isHidden: false },
        { value: '6', suit: 'spades', isHidden: false },
      ];
      const playerHand = new BlackJackPlayerHand(cards);
      expect(playerHand.isSplitPossible).toBe(false);
    });
  });
});
