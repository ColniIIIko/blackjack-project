import { render } from '@testing-library/react';
import PlayerCardHand from '../components/CardHand/PlayerCardHand';

describe('PlayerCardHand', () => {
  const props = {
    isWin: false,
    isLose: false,
    isCurrent: false,
    score: 21,
    hand: [
      { suit: 'hearts', value: 'A', isHidden: false },
      { suit: 'diamonds', value: '10', isHidden: false },
    ],
    endGameLabel: null,
    bet: 25,
  };

  it('should render the correct score and cards', () => {
    const { getByText, getByAltText } = render(<PlayerCardHand {...(props as any)} />);
    expect(getByText('21')).toBeInTheDocument();
    expect(getByAltText('hearts A')).toBeInTheDocument();
    expect(getByAltText('diamonds 10')).toBeInTheDocument();
  });

  it('should render the end game label when provided', () => {
    const { getByText } = render(
      <PlayerCardHand
        {...(props as any)}
        isLose={true}
        endGameLabel='BUST'
      />
    );
    expect(getByText('BUST')).toBeInTheDocument();
  });

  it('should renders the bet amount when provided', () => {
    const { getByText } = render(<PlayerCardHand {...(props as any)} />);
    expect(getByText('25')).toBeInTheDocument();
  });

  it('should applies the correct styles based on win', () => {
    const { getByText } = render(
      <PlayerCardHand
        {...(props as any)}
        isWin={true}
      />
    );
    const scoreBox = getByText('21');
    expect(scoreBox).toHaveClass('score-box__win');
  });

  it('should applies the correct styles based on lose', () => {
    const { getByText } = render(
      <PlayerCardHand
        {...(props as any)}
        isLose={true}
      />
    );
    const scoreBox = getByText('21');
    expect(scoreBox).toHaveClass('score-box__lose');
  });
});
