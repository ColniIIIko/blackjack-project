import { render, fireEvent } from '@testing-library/react';
import BetChoice from '../components/BetChoice/BetChoice';
import { Bet } from '../types/general';
import { GlobalContext } from '../stores/GlobalStore';

const mockOnBet = jest.fn();
const mockSetPreviousBet = jest.fn();
const renderBetChoice = (defaultBet: Bet = 20, isTimerOn: boolean = false) =>
  render(
    <GlobalContext.Provider value={{ userStore: { setPreviousBet: mockSetPreviousBet } } as any}>
      <BetChoice
        onBet={mockOnBet}
        defaultBet={defaultBet}
        isTimerOn={isTimerOn}
      />
    </GlobalContext.Provider>
  );

jest.useFakeTimers();

describe('BetChoice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render bet options', () => {
    const { getByText } = renderBetChoice();
    expect(getByText('20')).toBeInTheDocument();
    expect(getByText('25')).toBeInTheDocument();
    expect(getByText('50')).toBeInTheDocument();
    expect(getByText('100')).toBeInTheDocument();
    expect(getByText('200')).toBeInTheDocument();
  });

  it('should select a bet option', () => {
    const { getByText } = renderBetChoice();
    const betOption = getByText('50');

    fireEvent.click(betOption);
    expect(betOption).toHaveClass('option_active');
  });

  it('should confirm bet on double click', () => {
    const { getByText } = renderBetChoice();
    const betOption = getByText('50');
    fireEvent.click(betOption);
    fireEvent.doubleClick(betOption);
    expect(mockSetPreviousBet).toHaveBeenCalledWith(50);
    expect(mockOnBet).toHaveBeenCalledWith(50);
  });

  it('should start timer when isTimerOn is true', () => {
    const { getByText, getByTestId } = renderBetChoice(20, true);
    expect(getByText('MAKE YOUR BET')).toBeInTheDocument();
    expect(getByTestId('timer')).toBeInTheDocument();
  });
});
