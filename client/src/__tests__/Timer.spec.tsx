import { render, act } from '@testing-library/react';
import Timer from '../components/Timer/Timer';

const onTimerEnd = jest.fn();
const renderTimer = (startTime: number = 10) =>
  render(
    <Timer
      startTime={startTime}
      onTimerEnd={onTimerEnd}
    />
  );

jest.useFakeTimers();

describe('Timer', () => {
  beforeEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  it('should render the initial counter value', () => {
    const { container } = renderTimer();
    expect(container).toHaveTextContent('10');
  });

  it('should update the counter value each second', () => {
    const { container } = renderTimer();

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(container).toHaveTextContent('9');

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(container).toHaveTextContent('8');
  });

  it('should call the onTimerEnd callback when the counter reaches 0', () => {
    renderTimer(2);
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(onTimerEnd).toHaveBeenCalledTimes(1);
  });
});
