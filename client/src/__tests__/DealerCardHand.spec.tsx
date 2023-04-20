import { render } from '@testing-library/react';
import DealerCardHand from '../components/CardHand/DealerCardHand';

describe('DealerCardHand', () => {
  const props = {
    isBusted: false,
    score: 21,
    hand: [
      { suit: 'hearts', value: 'A', isHidden: false },
      { suit: 'diamonds', value: '10', isHidden: false },
    ],
  };

  it('should render the correct score and cards', () => {
    const { getByText, getByAltText } = render(<DealerCardHand {...(props as any)} />);
    expect(getByText('21')).toBeInTheDocument();
    expect(getByAltText('hearts A')).toBeInTheDocument();
    expect(getByAltText('diamonds 10')).toBeInTheDocument();
  });

  it('should applies the correct styles based on bust', () => {
    const { getByText } = render(
      <DealerCardHand
        {...(props as any)}
        isBusted={true}
      />
    );
    const scoreBox = getByText('21');
    expect(scoreBox).toHaveClass('score-box__lose');
  });
});
