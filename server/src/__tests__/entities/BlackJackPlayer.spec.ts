import { Card } from 'types/cards';
import { BlackJackPlayer } from '../../entities/BlackJackPlayer';
import { BlackJackPlayerHand } from '../../entities/BlackJackPlayerHand';

describe('BlackJackPlayer', () => {
  let player: BlackJackPlayer;

  beforeEach(() => {
    player = new BlackJackPlayer('1', 'Test Player', 100, '12345');
  });

  describe('reset', () => {
    it('should reset the player to the initial state saving isActive', () => {
      player.hand.push(new BlackJackPlayerHand());
      player.isSplitted = true;
      player.totalWin = 20;
      player.insuranceBet = 5;
      player.isActive = true;
      player.isCurrent = true;

      player.reset();

      expect(player.hand.length).toEqual(1);
      expect(player.isSplitted).toBe(false);
      expect(player.totalWin).toBeNull();
      expect(player.insuranceBet).toBeNull();
      expect(player.isActive).toBe(true);
      expect(player.isCurrent).toBe(false);
    });
  });

  describe('splitHand', () => {
    it('should not split hand if it has already been splitted', () => {
      player.hand[0].cards = [
        { value: '10', suit: 'diamonds', isHidden: false },
        { value: 'K', suit: 'spades', isHidden: false },
      ];
      player.hand.push(new BlackJackPlayerHand());
      player.isSplitted = true;

      const isSplitted = player.splitHand();

      expect(isSplitted).toBe(false);
      expect(player.hand.length).toEqual(2);
      expect(player.isSplitted).toBe(true);
    });

    it('should not split hand if the two cards have different values', () => {
      player.hand[0].cards = [
        { value: '10', suit: 'diamonds', isHidden: false },
        { value: 'Q', suit: 'hearts', isHidden: false },
      ];

      const isSplitted = player.splitHand();

      expect(isSplitted).toBe(false);
      expect(player.hand.length).toEqual(1);
      expect(player.isSplitted).toBe(false);
    });

    it('should split hand if it is possible and has not been splitted before', () => {
      player.hand[0].cards = [
        { value: '10', suit: 'diamonds', isHidden: false },
        { value: '10', suit: 'spades', isHidden: false },
      ];
      const isSplitted = player.splitHand();
      const balance = player.balance;
      const bet = player.hand[0].bet;

      expect(isSplitted).toBe(true);
      expect(player.balance).toEqual(balance - bet);
      expect(player.hand.length).toEqual(2);
      expect(player.isSplitted).toBe(true);
      expect(player.hand[0].cards.length).toEqual(1);
      expect(player.hand[1].cards.length).toEqual(1);
      expect(player.hand[1].bet).toEqual(bet);
    });
  });

  describe('hasNextHand', () => {
    it('should return false if the player has not splitted', () => {
      const result = player.hasNextHand();
      expect(result).toBe(false);
    });

    it('should return false if the current hand is not the first hand', () => {
      player.hand = [new BlackJackPlayerHand(), new BlackJackPlayerHand()];
      player.isSplitted = true;
      player.currentHand = player.hand[1];

      const result = player.hasNextHand();
      expect(result).toBe(false);
    });

    it('should return true if the player has splitted and the current hand is the first hand', () => {
      player.hand.push(new BlackJackPlayerHand());
      player.isSplitted = true;

      const result = player.hasNextHand();
      expect(result).toBe(true);
    });
  });

  describe('setNextHand', () => {
    it('should set currentHand to second hand if isSplitted is true and currentHand is first hand', () => {
      player.hand[0].cards = [
        { value: '10', suit: 'spades', isHidden: false },
        { value: '10', suit: 'hearts', isHidden: false },
      ];
      player.splitHand();
      expect(player.currentHand).toBe(player.hand[0]);
      player.setNextHand();
      expect(player.currentHand).toBe(player.hand[1]);
    });

    it('should not change currentHand if isSplitted is true and currentHand is second hand', () => {
      player.hand[0].cards = [
        { value: '10', suit: 'spades', isHidden: false },
        { value: '10', suit: 'hearts', isHidden: false },
      ];
      player.splitHand();
      player.setNextHand();
      expect(player.currentHand).toBe(player.hand[1]);
      player.setNextHand();
      expect(player.currentHand).toBe(player.hand[1]);
    });

    it('should not change currentHand if isSplitted is false', () => {
      expect(player.currentHand).toBe(player.hand[0]);
      player.setNextHand();
      expect(player.currentHand).toBe(player.hand[0]);
    });
  });
});
