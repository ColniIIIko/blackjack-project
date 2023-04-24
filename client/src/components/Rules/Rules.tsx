import React from 'react';

import styles from './rules.module.css';

function Rules() {
  return (
    <div className={styles['window']}>
      <h2 className={styles['rules-header']}>Blackjack</h2>
      <p className={styles['rules-paragraph']}>
        The objective of LIVE BLACKJACK is to achieve a higher card count than the dealer, but without going over 21.
        The best hand is Blackjack - when the sum of values of the first two dealt cards is exactly 21. You compete only
        against the dealer, not against other players.
      </p>
      <ul className={styles['rules-list']}>
        <li className={styles['rules-list-item']}>Played with 2 decks.</li>
        <li className={styles['rules-list-item']}>Dealer always stands on 17.</li>
        <li className={styles['rules-list-item']}>Double Down on any 2 initial cards.</li>
        <li className={styles['rules-list-item']}>Split initial cards of equal value.</li>
        <li className={styles['rules-list-item']}>Only one Split per hand.</li>
        <li className={styles['rules-list-item']}>No Double Down after Split.</li>
        <li className={styles['rules-list-item']}>Insurance offered when dealer shows an Ace.</li>
        <li className={styles['rules-list-item']}>Blackjack pays 3 to 2.</li>
        <li className={styles['rules-list-item']}>Insurance pays 2 to 1.</li>
        <li className={styles['rules-list-item']}>Push game when hands tie.</li>
      </ul>
      <h3 className={'rules-subheader'}>Game Rules</h3>
      <p className={styles['rules-paragraph']}>The game is hosted by a dealer and allows up to 3 players.</p>
      <p className={styles['rules-paragraph']}>
        The game is played with two standard 52-card decks. Card values are as follows:
      </p>
      <ul className={styles['rules-list']}>
        <li className={styles['rules-list-item']}>Cards from 2 to 10 are worth their face value.</li>
        <li className={styles['rules-list-item']}>Face cards (Jacks, Queens and Kings) are each worth 10.</li>
        <li className={styles['rules-list-item']}>
          Aces are worth 1 or 11, whichever is more favourable to the hand. Note that a soft hand includes and Ace worth
          11.
        </li>
        <li className={styles['rules-list-item']}>Double Ace always counts as 12</li>
      </ul>
      <p className={styles['rules-paragraph']}>
        After the allotted betting time has expired, the dealer deals one card face up to each player. Dealing starts
        with the first player to the dealer's left and continues clockwise, ending with the dealer. The dealer then
        deals a second card face up to each player and face down to himself. The value of your initial hand is displayed
        next to your cards.
      </p>
      <h3 className={'rules-subheader'}>Blackjack</h3>
      <p className={styles['rules-paragraph']}>
        If the value of your original two-card hand is exactly 21, you have Blackjack!
      </p>
      <h3 className={'rules-subheader'}>Insurance</h3>
      <p className={styles['rules-paragraph']}>
        If the dealer's upcard is an Ace, you are given the option to purchase insurance to offset the risk that the
        dealer has blackjack - even when you have blackjack yourself. The amount of insurance is equal to one half of
        your main bet, and the insurance bet is settled separately from the bet on your hand. The dealer then peeks at
        the value of his downcard to check for blackjack. If the dealer does not have blackjack, the round continues. If
        the dealer has blackjack, but you do not, the dealer's hand wins. If you and the dealer both have blackjack, the
        game ends in a push and your bet is returned. Note that when the dealer's upcard is a ten or face card, you will
        be given no option to purchase insurance, and the dealer will not peak at his downcard to check for blackjack.
      </p>
      <h3 className={'rules-subheader'}>Double Down, Hit or Stand</h3>
      <p className={styles['rules-paragraph']}>
        When the dealer does not have blackjack upon checking his two initial cards, players are given the chance to
        improve the values of their hands in turn, as the dealer moves clockwise around the table.
      </p>
      <p className={styles['rules-paragraph']}>
        If the value of your initial hand is not 21, you can decide to Double Down. In this case, you will double your
        bet and be dealt only one additional card to add to your hand. Alternatively, you can decide to Hit to be dealt
        an additional card to add to the value of your hand. You can hit more than once to receive additional cards
        before you decide to Stand once you are satisfied with the value of your hand.
      </p>
      <h3 className={'rules-subheader'}>Split</h3>
      <p className={styles['rules-paragraph']}>
        If your initial hand is a pair of cards of equal value, you can decide to Split the pair to make two separate
        hands, each with a separate bet equal to your main bet. After a second card is dealt to both your hands, you can
        improve the value of these two hands by using the hit option before you stand.
      </p>
      <h3 className={'rules-subheader'}>Outcome</h3>
      <p className={styles['rules-paragraph']}>
        If the sum of your hand exceeds 21, you bust and lose your bet on that hand.
      </p>
      <p className={styles['rules-paragraph']}>
        When all players have taken their turns, the dealer reveals the value of his downcard. The dealer must hit on a
        hand of 16 or less and must stand on a hand of soft 17 or more.
      </p>
      <p className={styles['rules-paragraph']}>
        You win when the value of your final hand is closer to 21 than the dealer's or when the dealer busts. If the
        value of your hand is the same as the dealer's, the game round ends in a push and your bet is returned.
      </p>
      <p className={styles['rules-paragraph']}>
        Blackjack beats a hand of 21 comprised of three or more cards. Blackjack also beats a hand of 21 resulting from
        a split pair.
      </p>
      <h2 className={styles['rules-header']}>PAYOUTS</h2>
      <ul className={styles['rules-list']}>
        <li className={styles['rules-list-item']}>Blackjack pays 3:2.</li>
        <li className={styles['rules-list-item']}>Winning hand pays 1:1.</li>
        <li className={styles['rules-list-item']}>If the dealer has blackjack, insurance pays 2:1.</li>
      </ul>
    </div>
  );
}

export default Rules;
